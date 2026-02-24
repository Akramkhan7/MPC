const bcrypt = require("bcrypt"); // agar bcryptjs use kar rahe ho: require("bcryptjs")
const jwt = require("jsonwebtoken");
const { db } = require("../config/db");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// ✅ Helper: create token
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ===================== REGISTER =====================
async function register(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");


    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      });
    }

    // check already exists
    const [exists] = await db.execute(
      "SELECT id FROM admins WHERE email = ? LIMIT 1",
      [email]
    );
    if (exists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "email already registered",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: { id: result.insertId, name, email },
    });
  } catch (err) {
    next(err);
  }
}

// ===================== LOGIN =====================
async function login(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [rows] = await db.execute(
      "SELECT id, name, email, password_hash FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = signToken({ adminId: admin.id });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ===================== ME (PROFILE) =====================
async function me(req, res, next) {
  try {
    const adminId = req.admin.adminId;

    const [rows] = await db.execute(
      "SELECT id, name, email, created_at FROM admins WHERE id = ? LIMIT 1",
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.json({ success: true, admin: rows[0] });
  } catch (err) {
    next(err);
  }
}

// ===================== UPDATE =====================
// Update name/email/password (jo fields bhejo, wahi update)
async function updateAdmin(req, res, next) {
  try {
    const adminId = req.admin.adminId;

    const name = String(req.body.name || "").trim();
    const emailRaw = req.body.email;
    const email = emailRaw ? normalizeEmail(emailRaw) : "";
    const password = String(req.body.password || "");

    // get current admin
    const [rows] = await db.execute(
      "SELECT id, name, email, password_hash FROM admins WHERE id = ? LIMIT 1",
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const current = rows[0];

    // ✅ email change check
    if (email && email !== current.email) {
      const [exists] = await db.execute(
        "SELECT id FROM admins WHERE email = ? AND id <> ? LIMIT 1",
        [email, adminId]
      );
      if (exists.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    let newPasswordHash = current.password_hash;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "password must be at least 6 characters",
        });
      }
      newPasswordHash = await bcrypt.hash(password, 10);
    }

    const newName = name || current.name;
    const newEmail = email || current.email;

    await db.execute(
      "UPDATE admins SET name = ?, email = ?, password_hash = ? WHERE id = ?",
      [newName, newEmail, newPasswordHash, adminId]
    );

    return res.json({
      success: true,
      message: "Admin updated successfully",
      admin: { id: adminId, name: newName, email: newEmail },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateAdmin };