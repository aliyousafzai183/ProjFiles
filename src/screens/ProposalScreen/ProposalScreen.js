import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBidsForSeller } from '../../database/bids';

const ProposalScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(true);
  const [invites, setInvites] = useState([]);
  const [bids, setBids] = useState([]);
  const [ongoing, setongoing] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  
  useEffect(() => {
    const fetchInvites = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getBidsForSeller(userId, "invited" ,(bids) => {
          setInvites(bids);
        });
      }
    };

    const fetchTotalBids = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getBidsForSeller(userId, "uninvited" ,(bids) => {
          setBids(bids);
        });
      }
    };

    const fetchOngoingBids = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getBidsForSeller(userId, "accepted", (bids) => {
          const ongoingBids = bids.filter((bid) => !bid.delivery);
          setongoing(ongoingBids);
        });
      }
    };
    

    const fetchPendingReviewBids = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getBidsForSeller(userId, "accepted", (bids) => {
          const pendingReviewBids = bids.filter((bid) => bid.delivery);
          setPending(pendingReviewBids);
        });
      }
    };
    

    const fetchCompletedBids = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getBidsForSeller(userId, "completed" ,(bids) => {
          setCompleted(bids);
        });
      }
    };

    fetchInvites();
    fetchTotalBids();
    fetchOngoingBids();
    fetchPendingReviewBids();
    fetchCompletedBids();
  }, []);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View>
      <List.Section>


        <List.Accordion
          title={`Applied for (${bids.length})`}
          left={props => <List.Icon {...props} icon="briefcase" />}
          onPress={handlePress}
        >
          {bids.map((bid) => (
            <TouchableOpacity key={bid.bidId} onPress={() => { navigation.navigate('View Job', { buyerId: bid.jobPosterId, jobId: bid.jobId, bidId: bid.bidId, type: "appliedfor" }) }}>
              <List.Item title={bid.jobTitle} description={bid.bidAmount + ' Pkr / Hour'}/>
            </TouchableOpacity>
          ))}
        </List.Accordion>

        <List.Accordion
          title={`Offers (${invites.length})`}
          left={props => <List.Icon {...props} icon="handshake" />}
        >
          {invites.map((invite) => (
            <TouchableOpacity key={invite.bidId} onPress={() => { navigation.navigate('View Job', { buyerId: invite.jobPosterId, jobId: invite.jobId, bidId: invite.bidId, type: "offers" }) }}>
              <List.Item title={invite.jobTitle} description={invite.bidAmount + ' Pkr / Hour'} />
            </TouchableOpacity>
          ))}
        </List.Accordion>

        <List.Accordion
          title={`Ongoing (${ongoing.length})`}
          left={props => <List.Icon {...props} icon="alarm-check" />}
        >
          {ongoing.map((invite) => (
            <TouchableOpacity key={invite.bidId} onPress={() => { navigation.navigate('View Job', { buyerId: invite.jobPosterId, jobId: invite.jobId, bidId: invite.bidId, type: "ongoing" }) }}>
              <List.Item title={invite.jobTitle} description={invite.bidAmount + ' Pkr / Hour'} />
            </TouchableOpacity>
          ))}
        </List.Accordion>

        <List.Accordion
          title={`Pending Review (${pending.length})`}
          left={props => <List.Icon {...props} icon="timer" />}
        >
          {pending.map((invite) => (
            <TouchableOpacity key={invite.bidId} onPress={() => { navigation.navigate('View Job', { buyerId: invite.jobPosterId, jobId: invite.jobId, bidId: invite.bidId, type: "pending" }) }}>
              <List.Item title={invite.jobTitle} description={invite.bidAmount + ' Pkr / Hour'} />
            </TouchableOpacity>
          ))}
        </List.Accordion>

        <List.Accordion
          title={`Completed (${completed.length})`}
          left={props => <List.Icon {...props} icon="check" />}
        >
          {completed.map((invite) => (
            <TouchableOpacity key={invite.bidId} onPress={() => { navigation.navigate('View Job', { buyerId: invite.jobPosterId, jobId: invite.jobId, bidId: invite.bidId, type: "completed" }) }}>
              <List.Item title={invite.jobTitle} description={invite.bidAmount + ' Pkr / Hour'} />
            </TouchableOpacity>
          ))}
        </List.Accordion>
      </List.Section>
    </View>
  );
};

export default ProposalScreen;