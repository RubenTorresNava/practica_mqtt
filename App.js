import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View } from 'react-native';

client = new Paho.Client(
  "broker.hivemq.com",
  Number(8000),
  `pruebapordiossal ${parseInt(Math.random() * 100)}`
);

export default function App() {

  const [value, setValue] = useState(0);

  function onMessage(message) {
    if (message.destinationName === "pruebapordiossal")
        setValue(message.payloadString);
  }

  useEffect(() => {
    client.connect( {
      onSuccess: () => { 
      console.log("Connected!");
      client.subscribe("pruebapordiossal");
      client.onMessageArrived = onMessage;
      
    },
    onFailure: () => {
      console.log("Failed to connect!"); 
    }
  });
  }, [])

  function onMessage(message) {
    if (message.destinationName === "pruebapordiossal") {
      const receivedValue = message.payloadString;
      setValue(receivedValue);
      console.log(`Received message: ${receivedValue}`);
      // Puedes agregar aquí cualquier otra lógica que desees ejecutar al recibir un mensaje.
    }
  }

  function changeValue(c) {
    const message = new Paho.Message((value + 1).toString());
    message.destinationName = "pruebapordiossal";
    c.send(message);
    console.log("Message sent!");
  }

  return (
    <View style={styles.container}>
      <Text>valor recibido: {value}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
