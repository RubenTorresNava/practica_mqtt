import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View } from 'react-native';
import { SafeAreaView, TextInput } from "react-native-web";

client = new Paho.Client(
  "broker.hivemq.com",
  Number(8000),
  `pruebapordiossal ${parseInt(Math.random() * 100)}`
);

export default function App() {

  const [value, setValue] = useState(0);
  const [limite, setLimite] = useState(15);

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

  function definirLimite(v) {
    const message = new Paho.Message(v.toString());
    message.destinationName = "limiteTempRuben";
    client.send(message);
    console.log("Message sent!");
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        onChangeText={setLimite}
      />
      <Button title="Cambiar valor" onPress={() => definirLimite(limite)} />
      <Text>Temperatura: {value}</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});
