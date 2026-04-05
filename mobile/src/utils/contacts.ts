import * as Contacts from "expo-contacts";
import { Alert, Platform } from "react-native";

const REMLY_PHONE = "+1234567890"; // Replace with your Retell number

export async function saveRemlyContact(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "We need contacts access to save the Remly AI number so your calls aren't blocked as spam."
    );
    return false;
  }

  // Check if already saved
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const alreadySaved = data.some((c) =>
    c.phoneNumbers?.some((p) => p.number?.replace(/\D/g, "").endsWith(REMLY_PHONE.replace(/\D/g, "")))
  );

  if (alreadySaved) {
    return true;
  }

  const contact: Contacts.Contact = {
    contactType: Contacts.ContactTypes.Person,
    name: "Remly AI Assistant",
    firstName: "Remly AI",
    lastName: "Assistant",
    phoneNumbers: [
      {
        label: "mobile",
        number: REMLY_PHONE,
      },
    ],
  };

  if (Platform.OS === "ios") {
    await Contacts.addContactAsync(contact);
  } else {
    await Contacts.addContactAsync(contact);
  }

  return true;
}
