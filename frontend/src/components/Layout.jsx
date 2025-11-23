import ScrollToTop from "../components/ScrollToTop";

export default function Layout({ children }) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
}