//api url
const API_URL =
  "https://script.google.com/macros/s/AKfycbw4Mw8x-qWq4OWZim-z-k-ObrqZCLWp6a7qFdBFWd5aWDhu-kdINdr3ld5wwIzQpiqhqA/exec";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// helper function for sending data to googlesheet/backend
/*
data = {
    name : "example name",
    preference : "male/female/no pref"
    phoneNo : "9400xxxxxx"
    email : ""
}
*/
const sendData = async (data) => {
  //remove this if its being handled already

  //validations
  if (String(data.phoneNo).length !== 10) {
    throw new Error("Error: Invalid Phone no");
  }
  if (!EMAIL_REGEX.test(data.email)) {
    throw new Error("Invalid email");
  }
  //sending data
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseResult = await response.json();
    console.log(responseResult);
  } catch (error) {
    console.error("Failed to send data:", error);
  }
};

/*const testData = {
  name: "Test Data final",
  preference: "Female",
  phoneNo: 940022448,
  email: "tanjiro@gectcr.com",
};

const testBtn = document.getElementById("test-btn");
testBtn.addEventListener("click", async () => {
  await sendData(testData);
});*/
