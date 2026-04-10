/**
 * Shared Footer Component - Simple footer for the layout.
 */
const Footer = () => {
  return (
    <footer
      style={{
        padding: "1rem",
        background: "#333",
        color: "#fff",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} My Application. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
