import { CircularProgress, Container, Stack, Typography } from "@mui/material";

export default function Prefetching() {
  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography>Pre-filling data from the patient record...</Typography>
      </Stack>
    </Container>
  );
}
