const { getDoc, doc, updateDoc } = require('firebase/firestore');
const { firestore } = require('../firebase.js');

// Express controller to get timetable by day
async function getTimetableByDay(req, res) {
    const { departmentId, yearId, day } = req.params;
  
    try {
      const timetableRef = doc(firestore, 'timetables', departmentId, 'years', yearId);
      const docSnapshot = await getDoc(timetableRef);
  
      if (docSnapshot.exists()) {
        const timetableData = docSnapshot.data().timetable || [];
        const timetableByDay = timetableData.filter(entry => entry.day === day);
        res.json([...timetableByDay]);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get timetable for the specified day. Try again later. 😞' });
    }
  }
  


// Express Controller to get all timetables
async function getAllTimetables(req, res) {
    const { departmentId, yearId } = req.params;
  
    try {
      const timetableRef = doc(firestore, 'timetables', departmentId, 'years', yearId);
      const docSnapshot = await getDoc(timetableRef);
  
      if (docSnapshot.exists()) {
        const allTimetables = docSnapshot.data().timetable || [];
  
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']; 

        const structuredTimetables = days.map(day => ({
          [day]: allTimetables.filter(entry => entry.day === day)
        }));
  
        res.json({ allTimetables: structuredTimetables });
      } else {
        res.json({ allTimetables: [] });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get all timetables. Try again later. 😞' });
    }
}
  

const timetableToAdd = [
    { day: 'MONDAY', course: 'MTH270.1', time: '12-2pm', venue: 'MBA 2' },
    { day: 'MONDAY', course: 'STA260.1', time: '2-4pm', venue: 'MBA 2' },
  
    { day: 'TUESDAY', course: 'CSC283.1', time: '11-12pm', venue: 'Csc hall 2' },
    { day: 'TUESDAY', course: 'CSC280.1', time: '12-2pm', venue: 'Fos Auditorium' },
    { day: 'TUESDAY', course: 'CSC288.1', time: '2-3pm', venue: 'Csc hall 2' },
    { day: 'TUESDAY', course: 'CSC284.1', time: '4-6pm', venue: 'Csc hall 2' },
  
    { day: 'WEDNESDAY', course: 'CSC283.1', time: '8-9am', venue: 'Mbs 14' },
    { day: 'WEDNESDAY', course: 'CSC281.1', time: '10-11am', venue: 'Csc hall 2' },
    { day: 'WEDNESDAY', course: 'MTH210.1', time: '2-4pm', venue: 'Fos Auditorium' },
  
    { day: 'THURSDAY', course: 'CSC284.1', time: '8-9am', venue: 'Mbs 14' },
    { day: 'THURSDAY', course: 'CSC288.1', time: '12-1pm', venue: 'Csc hall 2' },
    { day: 'THURSDAY', course: 'MTH270.1', time: '3-4pm', venue: 'MBA 2' },
    { day: 'THURSDAY', course: 'CSC281.1', time: '4-5pm', venue: 'Csc hall 2' },
  
    { day: 'FRIDAY', course: 'STA260.1', time: '9-10am', venue: 'MBA 2' },
    { day: 'FRIDAY', course: 'CSC280.1', time: '10-11am', venue: 'MBA 2' },
    { day: 'FRIDAY', course: 'CSC283.1', time: '2-4pm', venue: 'MBA 1' },
    { day: 'FRIDAY', course: 'MTH210.1', time: '4-5pm', venue: 'MBA 2' },
  ];
  
async function addTimetableEntries(departmentId, yearId, newTimetableEntries) {
  const timetableRef = doc(firestore, 'timetables', departmentId, 'years', yearId);

  try {
    const docSnapshot = await getDoc(timetableRef);

    if (docSnapshot.exists()) {
      const currentTimetable = docSnapshot.data().timetable || [];
      const updatedTimetable = [...currentTimetable, ...newTimetableEntries];

      await updateDoc(timetableRef, { timetable: updatedTimetable });
      return { success: true, message: 'Timetable entries added successfully! 🎉' };
    } else {
      return { success: false, error: 'Department or year not found. 😞' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to retrieve timetable. Try again later. 😞' };
  }
}

// console.log( addTimetableEntries('computer_science','100',timetableToAdd) )

module.exports = {
  getAllTimetables,
  getTimetableByDay
};
