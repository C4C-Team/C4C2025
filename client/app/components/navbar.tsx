import { Link } from "react-router-dom";
import { Button, Flex, HStack, Text, Box } from "@chakra-ui/react";

//console.log(__filename)
export function Navbar() {

  return (
      <Flex h={16} 
      alignItems={"center"}
      justifyContent={"space-between"}
      bg="red.400"
      px={8}
      position="relative"
      >
      <HStack gap={2} alignItems={"center"} direction="row">
        <Link to="/">
          <Button>
            Home
          </Button>
        </Link>
        <Link to="/about">
          <Button>
            About
          </Button>
        </Link>
        <Link to="/submission">
          <Button>
            Submit a Form
          </Button>
        </Link>
      </HStack>
      <Box position="absolute" left="50%" transform="translateX(-50%)">
        <Text fontSize="lg" fontWeight="bold" color="white" >
          Alachua County Cleanup Report
        </Text>
      </Box>
      </Flex>
  );
}
