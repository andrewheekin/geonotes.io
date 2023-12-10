import { Container, Typography } from "@mui/material";

export default function Submit() {
  return (
    <Container style={{ maxWidth: "900px", fontFamily: "monospace", minHeight: "1300px" }}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSfhamZgIiqcH8azYkA--gP3cc-KbbnGiRypb1M9zjDqjld_ug/viewform?embedded=true"
        width="100%"
        height="1300"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
      >
        Loading…
      </iframe>
    </Container>
  );
}
