import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Link from "next/link";

import type { Rainbow } from "../types/rainbow";

const ENDPOINT =
  "https://rainbow.me/api/assets?network=ethereum&address=0x241654d47b37fbece8660a6c2e2893106e623a8d&cursor=start";

export interface HomePageProps {
  data: Rainbow["results"];
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(ENDPOINT);
  const json = (await response.json()) as Rainbow;

  const data = json.results.filter((val) => {
    return val.token_id !== "0";
  });

  return {
    props: { data },
  };
};

export default function HomePage({ data }: HomePageProps) {
  return (
    <Box>
      <Container maxW="6xl" py="10">
        <Heading as="h1" pb="4" size="xl">
          Rainbow Clown
        </Heading>

        <Flex flexWrap="wrap" gap={6} justifyContent="space-around">
          {data.map((rainbow) => {
            return (
              <Box key={rainbow.token_id}>
                <Link as={`/nft/${rainbow.asset_contract.address}_${rainbow.token_id}`} href="/nft/[address]" passHref>
                  <Box
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "0.2s",
                    }}
                    boxSize={{ base: "90vw", md: "45vw", lg: "30vw", xl: "13vw" }}
                    cursor="pointer"
                    overflow="hidden"
                    rounded="2xl"
                    shadow="2xl"
                  >
                    <Image
                      alt={rainbow.metadata.name ?? rainbow.token_id}
                      h="full"
                      objectFit="cover"
                      src={rainbow.metadata.image_url}
                      w="full"
                    />
                  </Box>
                </Link>
                <Text color="gray.400" fontSize="sm" fontWeight="bold" pl="2" pt="1">
                  {rainbow.metadata.name ?? rainbow.token_id}
                </Text>
              </Box>
            );
          })}
        </Flex>
      </Container>
    </Box>
  );
}
