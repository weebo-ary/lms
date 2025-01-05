import { TextField, Button, Typography, Link, Box } from "@mui/material";
import Logo from "../assets/logo/1.svg";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";
import { FaThumbsUp } from "react-icons/fa";
import bcrypt from "bcryptjs";

const Register = () => {
  const [studentId, setStudentId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerify = async () => {
    setError(""); // Clear previous errors

    if (!studentId.trim()) {
      setError("Student ID is required.");
      return;
    }

    try {
      // Check if studentId already exists in the `student-reg` collection
      const regQuery = query(
        collection(db, "student-reg"),
        where("studentId", "==", studentId)
      );
      const regSnapshot = await getDocs(regQuery);

      if (!regSnapshot.empty) {
        // If studentId exists in the `student-reg` collection
        setError("Student already exists.");
        setIsVerified(false);
        return;
      }

      // Check if studentId exists in the `student-id` collection
      const idQuery = query(
        collection(db, "student-id"),
        where("id", "array-contains", studentId)
      );
      const idSnapshot = await getDocs(idQuery);

      if (!idSnapshot.empty) {
        // If studentId exists in the `student-id` collection and is not in `student-reg`
        setIsVerified(true);
        setError("");
      } else {
        // If studentId is not found in `student-id`
        setError("Student ID not found.");
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Error verifying student ID:", err);
      setError("An error occurred while verifying the student ID.");
      setIsVerified(false);
    }
  };

  // Password Validation Function
  const validatePassword = (value) => {
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 6;

    if (!hasLetter) return "Password must include at least one letter.";
    if (!hasNumber) return "Password must include at least one number.";
    if (!hasSymbol) return "Password must include at least one symbol.";
    if (!hasMinLength) return "Password must be at least 6 characters long.";

    return "";
  };

  // Real-time Password Validation
  const handlePasswordChange = (value) => {
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
  };

  // Real-time Confirm Password Validation
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRegister = async () => {
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    if (passwordError || confirmPasswordError) {
      setError("Please fix the password validation errors.");
      return;
    }

    if (!isVerified) {
      setError("Please verify your Student ID first.");
      return;
    }

    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

      // Save the registration details to Firestore
      await addDoc(collection(db, "student-reg"), {
        studentId, // Save the verified student ID
        name,
        email,
        password: hashedPassword, // Save the hashed password
        allowStudent: false,
        createdAt: new Date(), // Optional: Save the timestamp
      });

      // Show success message and clear the form
      setSuccessMessage("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setStudentId("");
      setIsVerified(false);
    } catch (err) {
      console.error("Error registering student:", err);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: 500,
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            display: "block",
            margin: "0 auto",
            width: 250,
            height: 250,
            marginTop: "-15%",
          }}
        />
        <Box
          sx={{
            marginTop: "-10%",
          }}
        >
          <Typography variant="h5" align="left" gutterBottom>
            Register as Flixer 😉
          </Typography>
          {isVerified ? (
            <Typography
              variant="body2"
              color="white"
              align="left"
              sx={{
                background: "green",
                padding: 1,
                borderRadius: 2,
                width: "fit-content",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FaThumbsUp color="white" /> Verified
            </Typography>
          ) : (
            <>
              <Typography
                variant="body2"
                color="white"
                align="left"
                sx={{
                  background: "orange",
                  padding: 1,
                  borderRadius: 2,
                  width: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CgDanger /> Please Verify Student ID
              </Typography>
            </>
          )}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                label="Student ID"
                variant="outlined"
                fullWidth
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isVerified} // Disable input if verified
              />
              <Button
                variant={isVerified ? "" : "outlined"}
                color={isVerified ? "success" : "primary"}
                onClick={handleVerify}
                disabled={isVerified} // Disable button if already verified
              >
                {isVerified ? (
                  <Typography variant="h4" color="green">
                    <BiCheckDouble />
                  </Typography>
                ) : (
                  "Verify"
                )}
              </Button>
            </Box>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Name"
              type="text"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isVerified}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isVerified}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={!isVerified}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              disabled={!isVerified}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleRegister}
              disabled={!isVerified || !!passwordError || !!confirmPasswordError}
            >
              Register
            </Button>
          </Box>
          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 3, color: "text.secondary" }}
          >
            Having Trouble Registering? <Link href="#">Contact Us</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
