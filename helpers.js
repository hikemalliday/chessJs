// function getThreatPath(threat, king, spacesSet) {
//   let direction = null;
//   console.log(`getThreatPath.direction: ${direction}`);
//   if (threat.y > king.y && threat.x < king.x) direction = "DOWN_LEFT";
//   if (threat.y > king.y && threat.x > king.x) direction = "DOWN_RIGHT";
//   if (threat.y < king.y && threat.x < king.x) direction = "UP_LEFT";
//   if (threat.y < king.y && threat.x > king.x) direction = "UP_RIGHT";
//   if (threat.y > king.y) direction = "UP";
//   if (threat.y < king.y) direction = "DOWN";
//   if (threat.x < king.x) direction = "LEFT";
//   if (threat.x > king.x) direction = "RIGHT";
//   let y = king.y;
//   let x = king.x;

//   while (true) {
//     switch (direction) {
//       case "UP":
//         y = y - 1;
//         break;
//       case "DOWN":
//         y = y + 1;
//         break;
//       case "LEFT":
//         x = x - 1;
//         break;
//       case "RIGHT":
//         x = x + 1;
//       case "DOWN_LEFT":
//         y = y + 1;
//         x = x - 1;
//         break;
//       case "DOWN_RIGHT":
//         y = y + 1;
//         x = x + 1;
//         break;
//       case "UP_LEFT":
//         y = y - 1;
//         x = x - 1;
//         break;
//       case "UP_RIGHT":
//         y = y - 1;
//         x = x + 1;
//         break;
//     }
//     spacesSet.add([y, x]);
//     if (y == threat.y && x == threat.x) break;
//   }
//   spacesSet.add([threat.y, threat.x]);
// }
