import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import BerlingskeBold from "../TextWrapper/BerlingskeBold";
import { colors } from "@/app/utils/theme";
import moment from "moment";
import { icons } from "@/app/MyAssets";
import { vh } from "@/app/utils/units";
import ImageView from "react-native-image-viewing";

// Define interfaces for the item and data props
interface SessionItem {
  isAvailable: boolean;
  icon?: string;
  slot: string;
  rows: number;
}

interface CourtSession {
  title: string;
  courtType: string;
  session: SessionItem[];
  resources: string[];
}

interface BookingData {
  timeSlots: string[];
  bookingSessions: CourtSession[];
}

interface BookingCalendarProps {
  data: BookingData;
  date: string | Date;
  onBookingPress: (session: any, item: any) => void;
}

const BookingCalendarVersion2: React.FC<BookingCalendarProps> = ({
  data,
  date,
  onBookingPress,
}) => {
  const [currentCourts, setCurrentCourts] = useState<CourtSession[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current index for the courts
  const [selectedCourtResources, setSelectedCourtResources] = useState([]);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGalleryViewer, setGalleryViewer] = useState(false);
  const [greenSlotTime, setGreenSlotTime] = useState("");

  const COURTS_PER_PAGE = 3; // You display 3 courts at a time

  useEffect(() => {
    extractGreenSlotTime();
    const initialCourts = data.bookingSessions.slice(0, COURTS_PER_PAGE);
    setCurrentCourts(initialCourts);
    setCurrentIndex(0);
    sortGallery();
  }, [data]);

  const sortGallery = () => {
    let tempArr = [];
    data.bookingSessions.map((item) => {
      item.resources.map((element) => {
        tempArr.push({ uri: element });
      });
    });
    setGalleryImages(tempArr);
  };

  const extractGreenSlotTime = () => {
    const timeSlots = data.timeSlots;
    const selectedDate = moment(date); // Moment object for the selected date
    const currentTime = moment(); // Moment object for the current time

    let tempArr = [];
    // Iterate over time slots to find the first available slot
    for (const slot of timeSlots) {
      // Parse each time slot into a full Date object with the selected date
      const [hours, minutes] = slot.match(/\d+/g).map(Number);
      const isPM = slot.includes("pm");
      const slotDateTime = selectedDate.clone(); // Clone to avoid modifying selectedDate

      slotDateTime
        .hours(isPM ? (hours % 12) + 12 : hours % 12)
        .minutes(minutes)
        .seconds(0);

      // Check if this slot is after the current time
      if (slotDateTime.isAfter(currentTime)) {
        console.log(slot); // Return the first available slot time
        tempArr.push(slot);
      }
    }
    setGreenSlotTime(tempArr[0]);
    return null; // Return null if no available slot is found
  };

  const getColor = (item: SessionItem) => {
    if (!item.isAvailable && !item.icon) {
      return colors.unAvailable;
    }

    if (!item.isAvailable && item.icon) {
      return colors.booked;
    }

    const currentDay = moment(date).format("DD-MM-YYYY");

    const currentDate = moment(
      `${currentDay} ${item.slot}`,
      "DD-MM-YYYY hh:mma"
    );
    const selectedDate = moment(new Date());

    if (currentDate.isBefore(selectedDate) && item.isAvailable) {
      return colors.expiredSeesion;
    }

    if (item.isAvailable) {
      return colors.available;
    }
  };

  const getText = (item: SessionItem) => {
    if (!item.isAvailable && !item.icon) {
      return "Unavailable";
    }

    if (!item.isAvailable && item.icon) {
      return "Booked";
    }

    const currentDay = moment(date).format("DD-MM-YYYY");
    const currentDate = moment(
      `${currentDay} ${item.slot}`,
      "DD-MM-YYYY hh:mma"
    );
    const selectedDate = moment(new Date());

    if (currentDate.isBefore(selectedDate) && item.isAvailable) {
      return "Expired";
    }

    if (item.isAvailable) {
      return "+";
    }
  };

  const handleNext = () => {
    const remainingCourts = data.bookingSessions.length - (currentIndex + 3);
    console.log(remainingCourts, "remainingCourts");
    // Determine the number of courts we can shift forward by
    const shiftBy = Math.min(COURTS_PER_PAGE, remainingCourts);
    console.log(shiftBy, "shiftBy");

    // Calculate the new index
    const newIndex = currentIndex + shiftBy;
    console.log(newIndex, "newIndex");

    // Update the courts to be displayed
    setCurrentCourts(
      data.bookingSessions.slice(newIndex, newIndex + COURTS_PER_PAGE)
    );
    setCurrentIndex(newIndex);
  };

  const handlePrevious = () => {
    // Determine the number of courts we can shift backward by
    const shiftBy = Math.min(COURTS_PER_PAGE, currentIndex);

    // Calculate the new index
    const newIndex = currentIndex - shiftBy;

    // Update the courts to be displayed
    setCurrentCourts(
      data.bookingSessions.slice(newIndex, newIndex + COURTS_PER_PAGE)
    );
    setCurrentIndex(newIndex);
  };

  const handleDisabled = (item: any) => {
    const condition = getText(item);
    if (condition == "+") {
      return false;
    }
    if (condition == "Booked") {
      return false;
    }
    return true;
  };
  const isAvailableTimeSlot = (timeSlot: string, timeSlots: string[]) => {
    if (timeSlot == greenSlotTime) {
      return true;
    } else {
      return false;
    }
  };

  const handleCourtPress = (item) => {
    let data = [];
    item.resources.map((item: String) => {
      let obj = {
        uri: item,
      };
      data.push(obj);
    });
    setSelectedCourtResources(data);
    setShowImageViewer(true);
  };

  const handleGalleryPress = () => {
    setGalleryViewer(true);
  };

  return (
    <View style={{ flex: 1, width: "95%" }}>
      <BerlingskeBold>Book Your Slots</BerlingskeBold>
      <ImageView
        images={selectedCourtResources}
        imageIndex={0}
        visible={showImageViewer}
        onRequestClose={() => setShowImageViewer(false)}
      />

      <ImageView
        images={galleryImages}
        imageIndex={0}
        visible={showGalleryViewer}
        presentationStyle="overFullScreen"
        onRequestClose={() => setGalleryViewer(false)}
        FooterComponent={({ imageIndex }) => {
          return (
            <View style={{ alignSelf: "center", bottom: 40 }}>
              <Text style={{ color: "white" }}>
                {imageIndex} / {galleryImages.length}
              </Text>
            </View>
          );
        }}
      />
      <View style={styles.btnContainer}>
        {/* Previous button */}
        <TouchableOpacity
          onPress={handlePrevious}
          style={[
            styles.navigationContainer,
            currentIndex === 0 && { opacity: 0.5 }, // Disable styling when at the first set
          ]}
          disabled={currentIndex === 0} // Disable the button when at the first set
        >
          <Image
            source={icons.backArrow}
            style={[
              styles.navigationIcons,
              {
                tintColor: currentIndex == 0 ? "gray" : "black",
              },
            ]}
          />
          <Text style={{ color: currentIndex === 0 ? "gray" : "black" }}>
            Back
          </Text>
        </TouchableOpacity>

        {/* Next button */}
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.navigationContainer,
            currentIndex + COURTS_PER_PAGE >= data.bookingSessions.length && {
              opacity: 0.5,
            }, // Disable styling when at the end
          ]}
          disabled={
            currentIndex + COURTS_PER_PAGE >= data.bookingSessions.length
          } // Disable the button when at the end
        >
          <Text
            style={{
              color:
                currentIndex + COURTS_PER_PAGE >= data.bookingSessions.length
                  ? "gray"
                  : "black",
            }}
          >
            Next
          </Text>
          <Image
            source={icons.nextArrow}
            style={[
              styles.navigationIcons,
              {
                tintColor:
                  currentIndex + COURTS_PER_PAGE >= data.bookingSessions.length
                    ? "gray"
                    : "black",
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={{ height: 38, width: "100%", flexDirection: "row" }}>
        <TouchableOpacity
          onPress={handleGalleryPress}
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "#E0E0E0",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={icons.gallery}
            style={{
              width: 20,
              height: 20,
              resizeMode: "contain",
              marginRight: 5,
            }}
          />
          <Text style={{ fontSize: 12 }}>Gallery</Text>
        </TouchableOpacity>
        {currentCourts.map((item) => (
          <Pressable
            key={item.title}
            onPress={() => handleCourtPress(item)}
            style={{
              flex: 1,
              backgroundColor: colors.secondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{item.title}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: "#E0E0E0",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1 }}>
            {data.timeSlots.map((timeSlot, index) => (
              <View key={index} style={styles.time}>
                {isAvailableTimeSlot(timeSlot, data.timeSlots) && (
                  <View style={styles.greenLight} />
                )}
                <Text style={styles.timeFont}>{timeSlot || "N/A"}</Text>
              </View>
            ))}
          </View>

          {currentCourts.map((session, sessionIndex) => (
            <View style={{ flex: 1 }} key={sessionIndex}>
              {session.session.map((item, itemIndex) =>
                session?.session[itemIndex - 1]?.rows == 2 ? (
                  <View style={{}} />
                ) : (
                  <TouchableOpacity
                    onPress={() => onBookingPress(session, item)}
                    disabled={handleDisabled(item)}
                    key={itemIndex}
                    style={[
                      styles.court,
                      {
                        backgroundColor: getColor(item),
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      },
                      item.rows == 2 && { height: 80 },
                    ]}
                  >
                    {item.icon && (
                      <Image source={{ uri: item.icon }} style={styles.icon} />
                    )}
                    <Text style={{ fontSize: 10 }}>{getText(item)}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingCalendarVersion2;

const styles = StyleSheet.create({
  court: {
    height: 40,
    backgroundColor: colors.secondary,
    // width: 90,
    flex: 1,
    marginRight: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 2,
    overflow: "hidden",
    //
  },
  time: {
    width: "100%",
    backgroundColor: "black",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    // marginTop: 2,
    // marginRight: 10,
  },
  timeFont: {
    color: "white",
    fontWeight: "500",
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    position: "absolute",
    top: 3,
    right: 3,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  navigationIcons: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "15%",
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.5, // Optional: Visually indicate the button is disabled
  },
  greenLight: {
    backgroundColor: "#AAFF00",
    height: vh * 1.2,
    width: vh * 1.2,
    borderRadius: 100,
    position: "absolute",
    top: 5,
    right: 5,
  },
});
