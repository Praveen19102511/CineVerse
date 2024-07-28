// Import necessary components and hooks from Material-UI and React
import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Logo from "./Logo";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

// Define an object to represent the different authentication states
const actionState = {
  signin: "signin",
  signup: "signup"
};

// Define the AuthModal component
const AuthModal = () => {
  // Get the current authentication modal state from the Redux store
  const { authModalOpen } = useSelector((state) => state.authModal);

  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();

  // Initialize the local authentication state to signin
  const [action, setAction] = useState(actionState.signin);

  // Effect hook to reset the local authentication state to signin when the modal is opened
  useEffect(() => {
    if (authModalOpen) setAction(actionState.signin);
  }, [authModalOpen]);

  // Function to close the authentication modal
  const handleClose = () => dispatch(setAuthModalOpen(false));

  // Function to switch the authentication state
  const switchAuthState = (state) => setAction(state);

  // Render the authentication modal
  return (
    <Modal open={authModalOpen} onClose={handleClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: "600px",
        padding: 4,
        outline: "none"
      }}>
        <Box sx={{ padding: 4, boxShadow: 24, backgroundColor: "background.paper" }}>
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Logo />
          </Box>

          {/* Render the signin form if the current authentication state is signin */}
          {action === actionState.signin && <SigninForm switchAuthState={() => switchAuthState(actionState.signup)} />}

          {/* Render the signup form if the current authentication state is signup */}
          {action === actionState.signup && <SignupForm switchAuthState={() => switchAuthState(actionState.signin)} />}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;