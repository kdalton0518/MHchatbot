"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import { useSnackBar } from "@/components/providers/snackbar";
import { moduleService } from "@/utils";

interface SearchResult {
  id: number;
  context: string;
  response: string;
  similarity: number;
}

export default function SemanticSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSnackBar } = useSnackBar();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showSnackBar("Please enter a search query", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await moduleService.semantic_search(searchQuery);
      setResults(response);
      if (response.length === 0) {
        showSnackBar("No results found", "info");
      }
    } catch (error) {
      showSnackBar("Error performing semantic search", "error");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Semantic Search
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Search Query"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: "120px" }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Context</TableCell>
                <TableCell>Response</TableCell>
                <TableCell>Similarity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row) => (
                <TableRow key={row["id"]}>
                  <TableCell>{row["id"]}</TableCell>
                  <TableCell>{row["context"]}</TableCell>
                  <TableCell>{row["response"]}</TableCell>
                  <TableCell>{1 - row["similarity"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
