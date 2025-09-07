const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const {redisClient} = require('../utils/redisClient')

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password} = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.me = async (req, res) => {
  try {
    // req.user is set by your verifyUser middleware
    
    const userId = req.userId;

    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      console.log("➡️ Returning from Redis");
      return res.json(JSON.parse(cachedUser));
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      const safeUser = { 
      username: user.username,
    };

    await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(safeUser));

    res.json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const valid = await bcrypt.compare(password, user.passwordHash);
//     if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

//     const accessToken = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     // Set both tokens as httpOnly cookies
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       maxAge: 15 * 60 * 1000,
//       sameSite: 'Strict',
//       secure: process.env.NODE_ENV === 'production'
//     });

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       sameSite: 'Strict',
//       secure: process.env.NODE_ENV === 'production'
//     });

//     res.status(200).json({ message: 'Login successful' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // ✅ Only store refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production'
    });

    // ✅ Send access token in response (frontend keeps it in memory)
    res.status(200).json({
      message: 'Login successful',
      accessToken
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

// REFRESH TOKEN
exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};
