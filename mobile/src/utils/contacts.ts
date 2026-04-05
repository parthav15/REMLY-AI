import * as Contacts from "expo-contacts";
import { Alert } from "react-native";
import { CONTACT } from "../constants";

export async function saveRemlyContact(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "We need contacts access to save the Remly AI number so your calls aren't blocked as spam."
    );
    return false;
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const alreadySaved = data.some((c) =>
    c.phoneNumbers?.some((p) => p.number?.replace(/\D/g, "").endsWith(CONTACT.PHONE.replace(/\D/g, "")))
  );

  if (alreadySaved) {
    return true;
  }

  const contact: Contacts.Contact = {
    contactType: Contacts.ContactTypes.Person,
    name: CONTACT.DISPLAY_NAME,
    firstName: CONTACT.FIRST_NAME,
    lastName: CONTACT.LAST_NAME,
    phoneNumbers: [
      {
        label: CONTACT.PHONE_LABEL,
        number: CONTACT.PHONE,
      },
    ],
  };

  await Contacts.addContactAsync(contact);

  return true;
}
