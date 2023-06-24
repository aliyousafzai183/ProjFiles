import React from "react";
import { Box, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider } from "native-base";
import { View, ScrollView, Button } from 'react-native'

export default function FindJobScreen({navigation}) {
  return (
    <ScrollView>
      <View>
        <Box >
          <Box style={{ marginTop: 15 }} maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
          }} _web={{
            shadow: 2,
            borderWidth: 0
          }} _light={{
            backgroundColor: "gray.50"
          }}>
            <Box>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  Need a Plumber
                </Heading>
                <Text fontSize="xs" _light={{
                  color: "violet.500"
                }} _dark={{
                  color: "violet.400"
                }} fontWeight="500" ml="-0.5" mt="-1">
                  Category : Engineer
                </Text>
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    6 mins ago
                  </Text>
                </HStack>
              </Stack>
              <Text fontWeight="400">
                Bengaluru (also called Bangalore) is the center of India's high-tech
                industry. The city is also known for its parks and nightlife.
              </Text>
              <HStack alignItems="center">
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400">
                  Total Bids : 10+
                </Text>
              </HStack>
              <HStack alignItems="center" space={4} justifyContent="space-between">
                <Button  onPress={()=>{navigation.navigate("Bid Now")}} 
                  title="Bid Now"
                />
              </HStack>
            </Stack>
          </Box>

          <Box style={{ marginTop: 15 }} maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
          }} _web={{
            shadow: 2,
            borderWidth: 0
          }} _light={{
            backgroundColor: "gray.50"
          }}>
            <Box>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  Need a Plumber
                </Heading>
                <Text fontSize="xs" _light={{
                  color: "violet.500"
                }} _dark={{
                  color: "violet.400"
                }} fontWeight="500" ml="-0.5" mt="-1">
                  Category : Engineer
                </Text>
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    6 mins ago
                  </Text>
                </HStack>
              </Stack>
              <Text fontWeight="400">
                Bengaluru (also called Bangalore) is the center of India's high-tech
                industry. The city is also known for its parks and nightlife.
              </Text>
              <HStack alignItems="center">
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400">
                  Total Bids : 10+
                </Text>
              </HStack>
              <HStack alignItems="center" space={4} justifyContent="space-between">
              <Button onPress={() => navigation.navigate("Bid Now")}
                  title="Bid Now"
                />
              </HStack>
            </Stack>
          </Box>

          <Box style={{ marginTop: 15 }} maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
          }} _web={{
            shadow: 2,
            borderWidth: 0
          }} _light={{
            backgroundColor: "gray.50"
          }}>
            <Box>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  Need a Plumber
                </Heading>
                <Text fontSize="xs" _light={{
                  color: "violet.500"
                }} _dark={{
                  color: "violet.400"
                }} fontWeight="500" ml="-0.5" mt="-1">
                  Category : Engineer
                </Text>
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    6 mins ago
                  </Text>
                </HStack>
              </Stack>
              <Text fontWeight="400">
                Bengaluru (also called Bangalore) is the center of India's high-tech
                industry. The city is also known for its parks and nightlife.
              </Text>
              <HStack alignItems="center">
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400">
                  Total Bids : 10+
                </Text>
              </HStack>
              <HStack alignItems="center" space={4} justifyContent="space-between">
              <Button onPress={() => navigation.navigate("Bid Now")}
                  title="Bid Now"
                />

              </HStack>
            </Stack>
          </Box>
        </Box>

      </View>
    </ScrollView>
  );
};

