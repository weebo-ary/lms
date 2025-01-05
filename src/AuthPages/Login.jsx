import { TextField, Button, Typography, Link, Box } from "@mui/material";
import Logo from "../assets/logo/1.svg";
import bcrypt from "bcryptjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    if (!email.trim() || !password.trim()) {
      setError("Both email and password are required.");
      return;
    }

    try {
      // Step 1: Query the `student-reg` collection to find a matching email
      const regQuery = query(
        collection(db, "student-reg"),
        where("email", "==", email)
      );
      const regSnapshot = await getDocs(regQuery);

      if (regSnapshot.empty) {
        setError("Invalid email or password.");
        return;
      }

      // Step 2: Check the password and fetch user details
      let user = null;
      regSnapshot.forEach((doc) => {
        user = { id: doc.id, ...doc.data() };
      });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        setError("Invalid email or password.");
        return;
      }

      // Step 3: Check the `allowStudent` parameter
      if (!user.allowStudent) {
        setError(
          "Your ID is under review. It may take up to 12 hours for approval."
        );
        return;
      }

      // Step 4: Check if the `studentId` exists in the `student-id` collection
      const studentIdQuery = query(
        collection(db, "student-id"),
        where("id", "array-contains", user.studentId)
      );
      const studentIdSnapshot = await getDocs(studentIdQuery);

      if (studentIdSnapshot.empty) {
        setError("Student ID not found in the system.");
        return;
      }

      // Success: Login is successful
      setSuccessMessage("Login successful! Welcome to the LMS.");
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: 400,
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            display: "block",
            margin: "0 auto",
            width: 200,
            height: 200,
            marginTop: "-10%",
          }}
        />
        <Box
          sx={{
            marginTop: "-10%",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Please log in to your account.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 3,
            }}
          >
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error Message */}
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}

            {/* Success Message */}
            {successMessage && (
              <Typography variant="body2" color="success" align="center">
                {successMessage}
              </Typography>
            )}

            <Link href="#" variant="body2" sx={{ alignSelf: "flex-end" }}>
              Forgot Password?
            </Link>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 3, color: "text.secondary" }}
          >
            Having Trouble Logging In? <Link href="#">Contact Us</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
