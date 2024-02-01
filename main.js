// to run this file
// npm install
// node main.js

const { google } = require('googleapis')
require('dotenv').config()

const GOOGLE_PRIVATE_KEY = process.env.private_key
const GOOGLE_CLIENT_EMAIL = process.env.client_email
const GOOGLE_PROJECT_NUMBER = process.env.project_number
const GOOGLE_CALENDAR_ID = process.env.calendar_id

const SCOPES = ['https://www.googleapis.com/auth/calendar']

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
)

const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
})

const auth = new google.auth.GoogleAuth({
  keyFile: './keys.json',
  scopes: SCOPES,
})

const now = new Date()
const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const listCalendarEvents = (startTime, endTime) => {
  calendar.events.list(
    {
      auth: auth,
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    },
    (error, result) => {
      if (error) {
        console.log('Something went wrong: ', error)
      } else {
        if (result.data.items.length > 0) {
          console.log('List of upcoming events: ', result.data.items)
        } else {
          console.log('No upcoming events found.')
        }
      }
    }
  )
}

listCalendarEvents(now, oneWeekLater)
