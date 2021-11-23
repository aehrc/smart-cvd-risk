import { CircularProgress, Container, Stack, Typography } from "@mui/material";

export default function Prefetching() {
  return (
    <Container>
      <Stack spacing={2}>
        <CircularProgress />
        <Typography>Pre-filling data from the patient record...</Typography>
      </Stack>
    </Container>
  );
}
