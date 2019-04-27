import React from "react";
import {
  AsyncStorage,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Share
} from "react-native";
import { Button } from "react-native-elements";
import { format } from "date-fns";
import moment from "moment";

export default class ProfileScreen extends React.Component {

  static navigationOptions = {
    title: 'Profile',
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'white',
    },
    headerStyle: {
      backgroundColor: '#39CA74',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      eventsData: [],
      isLoading: false,
      error: null
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      console.log("token: ", token, userId);
    try {
      let response = await fetch(
        "http://ec2-54-183-219-162.us-west-1.compute.amazonaws.com:3000/users/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:token
          },
          body: 
          JSON.stringify({
            "UserId" : "35",
        })
        }
      );
      
      response.json().then(result => {      
      this.setState({ eventsData: result.data });
      });
    } catch (error) {
      this.setState({ loading: false, response: error });
      console.log(error);
    }
  } catch(e) {
    console.log("AsyncStorage failed to retrieve token:", e);
  }
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


  _renderEvents = (item) => {
    return(
    <View style={{ flexDirection: "row", paddingTop: 30 }}>
      <Image
        source={require("../img/sample_image.jpg")}
        style={styles.imageEx}
      />
      <View style={{ flex: 1, paddingLeft: 30 }}>
        <Text style={styles.titleStyling}>{item.Name}</Text>
        <Text style={{color: '#333'}}>
          {moment.utc(item.StartDate).format("MMMM DD")}{" | "}
          {format("January 01, 2019 "+item.StartTime,"hh:mm a")}
        </Text>
        <Text style={{color: '#333'}}>{item.LocationName}</Text>      
      </View>
    </View>    
    )
  }


  render() {
    const { eventsData } = this.state;
    return (      
    //   <Button
    //       title="Sign Out"
    //       titleStyle={{ fontSize: 20, marginTop: 5 }}
    //       containerStyle={{ marginTop: 20, marginBottom: 30 }}
    //       buttonStyle={{ height: 50, borderRadius: 5, backgroundColor: '#39CA74' }}
    //       activeOpacity={0.8}
    //       onPress={this._signOutAsync}
    //     />

    // );
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            data={eventsData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => this._renderEvents(item)}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    );
  


    }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginLeft: 20,
    backgroundColor: "#FFFFFF"
  },
  imageEx: {
    width: 120,
    height: 120
  },

  buttonContainerStyle: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 40
  },
  
  titleStyling: {
    fontFamily: "Verdana",
    fontSize: 18,
    marginBottom: 5
  },
  buttonStyling: {
    width: 60,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#39CA74',
  }
});
