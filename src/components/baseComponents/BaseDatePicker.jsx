// import React from "react";

// // import { format, parse } from "date-fns";
// import { makeStyles, TextField } from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     position: "relative",
//   },
//   display: {
//     position: "absolute",
//     top: 2,
//     left: 0,
//     bottom: 2,
//     background: "white",
//     pointerEvents: "none",
//     right: 50,
//     display: "flex",
//     alignItems: "center",
//     paddingLeft: theme.spacing(1),
//   },
//   input: {
//     opacity: 0, // Hide the original input to show the custom display
//   },
// }));

// function InputComponent({ defaultValue, inputRef, ...props }) {
//   const classes = useStyles();
//   const [value, setValue] = React.useState(() => {
//     if (props.value) {
//       return format(parse(props.value, "yyyy-MM-dd", new Date()), "dd/MM/yyyy");
//     } else if (defaultValue) {
//       return format(
//         parse(defaultValue, "yyyy-MM-dd", new Date()),
//         "dd/MM/yyyy"
//       );
//     }
//     return "";
//   });

//   const handleChange = (event) => {
//     const formattedDate = event.target.value;
//     setValue(formattedDate);

//     if (props.onChange) {
//       const parsedDate = format(
//         parse(formattedDate, "dd/MM/yyyy", new Date()),
//         "yyyy-MM-dd"
//       );
//       event.target.value = parsedDate;
//       props.onChange(event);
//     }
//   };

//   return (
//     <div className={classes.root}>
//       <div className={classes.display}>{value}</div>
//       <input
//         className={classes.input}
//         ref={inputRef}
//         {...props}
//         onChange={handleChange}
//         value={value}
//       />
//     </div>
//   );
// }

// function BaseDatePicker() {
//   return (
//     <TextField
//       id="date"
//       label="Birthday"
//       type="text"
//       InputProps={{
//         inputComponent: InputComponent,
//       }}
//       defaultValue="2017-05-24"
//       InputLabelProps={{
//         shrink: true,
//       }}
//     />
//   );
// }

// export default BaseDatePicker;
