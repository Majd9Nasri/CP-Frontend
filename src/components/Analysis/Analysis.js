import React, { useState } from "react";
import "./Analysis.scss";
import Field from "../reusableComppnents/Field/Field.js"
import { useSelector } from "react-redux";
import moment from "moment";
import { useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';


const Analysis = () => {

     //********** use selector **********//
  const opportunities = useSelector((state) => state.opportunity.opportunities);
  const roles = useSelector((state) => state.role.roles); 
 
   //********** use state **********//
  const [role, setRole] = useState(""); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [viewOpportunities , setViewOpportunities ] = useState(false);
  
const role1 = []
role1.push(role)

 //********** use effect **********//
  useEffect(() => {
    calculateKalenderweek();
  }, [startDate, endDate]);


  //********** function TO calculate Demand for the role **********//
  function calculateTotalDemand(data) {
    const demand = [];


    for (let r = 0; r< role1.length; r++) {
      const roleDemand = new Array(weeks.length).fill(0);
      demand.push(roleDemand);
  
    data.forEach((opportunity) => {
      opportunity.phases_json.forEach((phase) => {
        const phaseStartMoment = moment(phase.start, "YYYY-MM-DD");
        const phaseEndMoment = moment(phase.end, "YYYY-MM-DD");
        const phaseStartYear = phaseStartMoment.isoWeekYear();
        const phaseEndYear = phaseEndMoment.isoWeekYear();
        const phaseStartCalendarWeek = phaseStartMoment.isoWeek();
        const phaseEndCalendarWeek = phaseEndMoment.isoWeek();
        const phaseWeeks = [];
        for (let year = phaseStartYear; year <= phaseEndYear; year++) {
          let startWeek;
          if (year === phaseStartYear) {
            startWeek = phaseStartCalendarWeek;
          } else {
            startWeek = 1;
          }
          
          let endWeek;
          if (year === phaseEndYear) {
            endWeek = phaseEndCalendarWeek;
          } else {
            endWeek = moment(`${year}-12-31`).isoWeeksInYear();
          }

          for (let week = startWeek; week <= endWeek ; week++) {
            phaseWeeks.push(`${week}-${year}`);
          }
        }  
        phase.roleAssignment.forEach((assignment) => {
            for (let i = 0; i < weeks.length; i++) {
              if (phaseWeeks.includes(weeks[i]) && assignment.Role === role1[r] ) {
                let firstDaysRatio = 1;
                let lastDaysRatio = 1;

                if (weeks[i] === phaseWeeks[0]) {
                  const phaseStartWeekday = phaseStartMoment.isoWeekday();
                  if (phaseStartWeekday === 1) {
                    firstDaysRatio = 1;
                  } else if (phaseStartWeekday === 2) {
                    firstDaysRatio = 0.8;
                  } else if (phaseStartWeekday === 3) {
                    firstDaysRatio = 0.6;
                  } else if (phaseStartWeekday === 4) {
                    firstDaysRatio = 0.4;
                  } else if (phaseStartWeekday === 5) {
                    firstDaysRatio = 0.2;
                  } else {
                    firstDaysRatio= 0;
                } }


                if (weeks[i] === phaseWeeks[phaseWeeks.length - 1]) {
                  const phaseEndWeekday = phaseEndMoment.isoWeekday();
                  if (phaseEndWeekday  === 1) {
                    lastDaysRatio  = 0.2;
                  } else if (phaseEndWeekday  === 2) {
                    lastDaysRatio  = 0.4;
                  } else if (phaseEndWeekday  === 3) {
                    lastDaysRatio  = 0.6;
                  } else if (phaseEndWeekday  === 4) {
                    lastDaysRatio  = 0.8;
                  } else if (phaseEndWeekday  === 5) {
                    lastDaysRatio = 1;
                  } else {
                    lastDaysRatio = 1;
                } }
                demand[r][i] += parseInt(assignment.hours) * firstDaysRatio * lastDaysRatio  ;
              }
              else {
                demand[r][i] += 0;
              }
          }
        });
      });
    });
  }
    return demand;
  }
  const demand = calculateTotalDemand(opportunities);
  const roundedDemand = demand.map(innerArray => innerArray.map(number => Math.round(number)));
  
  //********** function TO calculate Demand for the role and For each opportunity **********//

  function calculateTotalDemandOpportunity(data) {


    //*** 1. Länge der Array bestimmen ***//

    const demandOpportunity = [];
    for (let i = 0; i < weeks.length; i++) {
      demandOpportunity.push([]);
    }
    
    //*** 2. Durchlaufen der Chancen ***//
    data.forEach((opportunity) => {
    
      //*** 3. Durchlaufen der Phasen innerhalb einer Chance ***//
      opportunity.phases_json.forEach((phase) => {
        const phaseStartMoment = moment(phase.start, "YYYY-MM-DD");
        const phaseEndMoment = moment(phase.end, "YYYY-MM-DD");
        const phaseStartYear = phaseStartMoment.isoWeekYear();
        const phaseEndYear = phaseEndMoment.isoWeekYear();
        const phaseStartCalendarWeek = phaseStartMoment.isoWeek();
        const phaseEndCalendarWeek = phaseEndMoment.isoWeek();
        const phaseWeeks = [];
    
        for (let year = phaseStartYear; year <= phaseEndYear; year++) {
          let startWeek;
          if (year === phaseStartYear) {
            startWeek = phaseStartCalendarWeek;
          } else {
            startWeek = 1;
          }
    
          let endWeek;
          if (year === phaseEndYear) {
            endWeek = phaseEndCalendarWeek;
          } else {
            endWeek = moment(`${year}-12-31`).isoWeeksInYear();
          }
    
          for (let week = startWeek; week <= endWeek; week++) {
            phaseWeeks.push(`${week}-${year}`);
          }
        }
    
        //*** 4. Die Kalenderwochen von jeder Phase sind bestimmt ***//
    //*** ***//
        phase.roleAssignment.forEach((assignment) => {
          let assignmentFound = false;
          let m;
          for (let m = 0; m < weeks.length; m++) {
            if (phaseWeeks.includes(weeks[m]) && assignment.Role === role) {
              let firstDaysRatio = 1;
              let lastDaysRatio = 1;
    
              if (weeks[m] === phaseWeeks[0]) {
                const phaseStartWeekday = phaseStartMoment.isoWeekday();
                if (phaseStartWeekday === 1) {
                  firstDaysRatio = 1;
                } else if (phaseStartWeekday === 2) {
                  firstDaysRatio = 0.8;
                } else if (phaseStartWeekday === 3) {
                  firstDaysRatio = 0.6;
                } else if (phaseStartWeekday === 4) {
                  firstDaysRatio = 0.4;
                } else if (phaseStartWeekday === 5) {
                  firstDaysRatio = 0.2;
                } else {
                  firstDaysRatio = 0;
                }
              }
    
              if (weeks[m] === phaseWeeks[phaseWeeks.length - 1]) {
                const phaseEndWeekday = phaseEndMoment.isoWeekday();
                if (phaseEndWeekday === 1) {
                  lastDaysRatio = 0.2;
                } else if (phaseEndWeekday === 2) {
                  lastDaysRatio = 0.4;
                } else if (phaseEndWeekday === 3) {
                  lastDaysRatio = 0.6;
                } else if (phaseEndWeekday === 4) {
                  lastDaysRatio = 0.8;
                } else if (phaseEndWeekday === 5) {
                  lastDaysRatio = 1;
                } else {
                  lastDaysRatio = 1;
                }
              }
    
              demandOpportunity[m].push({
                projekt: opportunity.name,
                dem: parseInt(assignment.hours) * firstDaysRatio * lastDaysRatio,
              });
            }
          }
        });
      });
    
      
      const found = demandOpportunity.some((innerArray) =>
      innerArray.some((item) => item.projekt === opportunity.name)
    );
    if (found) {
      demandOpportunity.forEach((innerArray) => {
        if (!innerArray.some((item) => item.projekt === opportunity.name)) {
          innerArray.push({
            projekt: opportunity.name,
            dem: 0,
          });
        }
      });
    }
    });
    
    return demandOpportunity;
  }
  const demandOpportunity = calculateTotalDemandOpportunity(opportunities);
  console.log(demandOpportunity)
  
  
  let dataview;
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];
 const borderColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];

  dataview = [];
  if (demandOpportunity && demandOpportunity.length > 0) {
    dataview = demandOpportunity[0].map((_, index) => {
      const label = demandOpportunity[0][index].projekt;
      const data = demandOpportunity.map((innerArray) => innerArray[index].dem);
      const backgroundColor = colors[index % colors.length]; 
      const  borderColor =  borderColors[index %  borderColors.length]; 
      return {
        label: label,
        data: data,
        stack: 'a',
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2
      };
    });
  }
  
console.log(dataview)
  



 //********** function TO calculate calendarWeeks  **********//

  const calculateKalenderweek = () => {
    if (startDate && endDate) {
      const startMoment = moment(startDate, "YYYY-MM-DD");
      const endMoment = moment(endDate, "YYYY-MM-DD");
      const startYear = startMoment.isoWeekYear();
      const endYear = endMoment.isoWeekYear();
      const startCalendarWeek = startMoment.isoWeek();
      const endCalendarWeek = endMoment.isoWeek();

      const weeksArray = [];
    for (let year = startYear; year <= endYear; year++) {
        let startWeek;
        if (year === startYear) {
          startWeek = startCalendarWeek;
        } else {
          startWeek = 1;
        }

        let endWeek;
        if (year === endYear) {
          endWeek = endCalendarWeek;
        } else {
          endWeek = moment(`${year}-12-31`).isoWeeksInYear();
        }

      for (let week = startWeek; week <= endWeek ; week++) {
        weeksArray.push(`${week}-${year}`);
      }
    }  
    setWeeks(weeksArray);
  }
};

//********** chart1 **********//
function generateBarChartData(role, roundedDemand) {
  const totalStack =  ["a","b","c","d","e","f","h","i","j","k","l","m"]
  
const multiDatasets = [];

for (let i = 0; i < role1.length; i++) {
  multiDatasets.push({
    label: `Bedarf an ${role1[i]}`,
    data: demand[i],
    stack: totalStack[i],
    backgroundColor: colors[i],
    borderColor: borderColors[i],
    borderWidth: 2,
  });
}

  const data = {
    labels: weeks.map((week) => moment(week, "W-YYYY").format("YYYY-MM-DD")),
    datasets: multiDatasets,
  };

  const options = {
    stack: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Kalenderwochen",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Bedarf in Stunden",
        },
        beginAtZero: true,
      },
    },
  };

  return { data, options };
}

//********** chart2**********//

function generateBarChartData2( dataview) {
  
  const data = {
    labels: weeks.map((week) => moment(week, "W-YYYY").format("YYYY-MM-DD")),
    datasets: dataview,
  };

  const options = {
    stack: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Kalenderwochen",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Bedarf in Stunden",
        },
        beginAtZero: true,
      },
    },
  };

  return { data, options };
}






//********** chart data **********//
let data = null;
let options = null;

if (!viewOpportunities) {
  ({ data, options } = generateBarChartData(role, roundedDemand));
}
else {
  ({ data, options } = generateBarChartData2(dataview));

}

//********** return **********//
  return (
    <>
 
    <div className="create-container">
      <div className="create-form">
        <select className="select-role" id="exampleFormControlSelect1"  value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Rolle</option>
          {roles.map((role) => (
            <option key={role.id}>{role.role_type}</option>
          ))}
        </select>
        <select className="select-role" id="exampleFormControlSelect1"   onChange={(e) => setViewOpportunities(e.target.value === "Mit Projektenansicht")}>
          <option>Ohne Projektenansicht</option>
          <option>Mit Projektenansicht</option>
        </select>
        
  
        <Field  text="Startdatum"  type="date"  value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        <Field text="Enddatum" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      </div>
   
      <div className="chart">
      <Bar data={data} options={options} />
        </div>
    </>
  );
};

export default Analysis;















// function calculateTotalDemand(data) {
//   const demand = new Array(weeks.length).fill(0);
//   data.forEach((opportunity) => {
//     opportunity.phases_json.forEach((phase) => {
//       const phaseStartMoment = moment(phase.start, "YYYY-MM-DD");
//       const phaseEndMoment = moment(phase.end, "YYYY-MM-DD");
//       const phaseStartYear = phaseStartMoment.isoWeekYear();
//       const phaseEndYear = phaseEndMoment.isoWeekYear();
//       const phaseStartCalendarWeek = phaseStartMoment.isoWeek();
//       const phaseEndCalendarWeek = phaseEndMoment.isoWeek();
//       const phaseWeeks = [];
//       for (let year = phaseStartYear; year <= phaseEndYear; year++) {
//         let startWeek;
//         if (year === phaseStartYear) {
//           startWeek = phaseStartCalendarWeek;
//         } else {
//           startWeek = 1;
//         }
        
//         let endWeek;
//         if (year === phaseEndYear) {
//           endWeek = phaseEndCalendarWeek;
//         } else {
//           endWeek = moment(`${year}-12-31`).isoWeeksInYear();
//         }

//         for (let week = startWeek; week <= endWeek ; week++) {
//           phaseWeeks.push(`${week}-${year}`);
//         }
//       }  
//       phase.roleAssignment.forEach((assignment) => {
//           for (let i = 0; i < weeks.length; i++) {
//             if (phaseWeeks.includes(weeks[i]) && assignment.Role === role ) {
//               let firstDaysRatio = 1;
//               let lastDaysRatio = 1;

//               if (weeks[i] === phaseWeeks[0]) {
//                 const phaseStartWeekday = phaseStartMoment.isoWeekday();
//                 if (phaseStartWeekday === 1) {
//                   firstDaysRatio = 1;
//                 } else if (phaseStartWeekday === 2) {
//                   firstDaysRatio = 0.8;
//                 } else if (phaseStartWeekday === 3) {
//                   firstDaysRatio = 0.6;
//                 } else if (phaseStartWeekday === 4) {
//                   firstDaysRatio = 0.4;
//                 } else if (phaseStartWeekday === 5) {
//                   firstDaysRatio = 0.2;
//                 } else {
//                   firstDaysRatio= 0;
//               } }


//               if (weeks[i] === phaseWeeks[phaseWeeks.length - 1]) {
//                 const phaseEndWeekday = phaseEndMoment.isoWeekday();
//                 if (phaseEndWeekday  === 1) {
//                   lastDaysRatio  = 0.2;
//                 } else if (phaseEndWeekday  === 2) {
//                   lastDaysRatio  = 0.4;
//                 } else if (phaseEndWeekday  === 3) {
//                   lastDaysRatio  = 0.6;
//                 } else if (phaseEndWeekday  === 4) {
//                   lastDaysRatio  = 0.8;
//                 } else if (phaseEndWeekday  === 5) {
//                   lastDaysRatio = 1;
//                 } else {
//                   lastDaysRatio = 1;
//               } }

//               demand[i] += parseInt(assignment.hours) * firstDaysRatio * lastDaysRatio  ;
//             }
//             else {
//               demand[i] += 0;
//             }
//         }
//       });
//     });
//   });

//   return demand;
// }
// const demand = calculateTotalDemand(opportunities);