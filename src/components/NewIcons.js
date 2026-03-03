import React from "react";
import { Svg, Path } from 'react-native-svg';

/*
Usage Example:

import { HomeIcon } from "./icons";

<HomeIcon size={28} color="#000" />
*/

const createIcon = (path) => ({ size = 24, color = "#e3e3e3", ...props }) => (
  <Svg
    viewBox="0 -960 960 960"
    width={size}
    height={size}
    {...props}
  >
    <Path d={path} fill={color} />
  </Svg>
);

/* ======================= ICONS ======================= */

export const HomeIcon = createIcon(
  "M160-160v-375l-72 55-47-63 439-337 440 336-48 64-392-300-240 184v356h120v80H160Zm437 80L428-250l56-57 113 113 227-226 56 57L597-80Z"
);

export const FeaturesIcon = createIcon(
  "M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Z"
);

export const CalendarIcon = createIcon(
  "M200-640h560v-80H200v80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-120H200Z"
);

export const ScorecardIcon = createIcon(
  "M240-240h220v-160H240v160Zm0-200h220v-280H240v280Zm260 200h220v-280H500v280ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"
);

export const ProfileIcon = createIcon(
  "M480-560q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
);

export const ClassesIcon = createIcon(
  "M160-400h640v-360H160v360Zm80 280v-80h200v-120H160q-33 0-56.5-23.5T80-400v-360q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v360q0 33-23.5 56.5T800-320H520v120h200v80H240Z"
);

export const TimetableIcon = createIcon(
  "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-120H200Z"
);

export const EventsIcon = createIcon(
  "M80-600v-160q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v160H80Zm80 360q-33 0-56.5-23.5T80-320v-200h800v200q0 33-23.5 56.5T800-240H160Z"
);

export const AttendanceIcon = createIcon(
  "m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"
);

export const LibraryIcon = createIcon(
  "M240-80q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h440v640H240Z"
);

export const ExamsIcon = createIcon(
  "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"
);

export const HostelIcon = createIcon(
  "M280-200h-40l-26-80h-54v-200h640v200h-54l-26 80h-40l-26-80H306l-26 80Z"
);

export const NoticeBoardIcon = createIcon(
  "M200-120q-33 0-56.5-23.5T120-200v-560h400v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Z"
);

export const GalleryIcon = createIcon(
  "M200-120q-33 0-56.5-23.5T120-200v-560h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Z"
);

export const ContactIcon = createIcon(
  "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h480q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Z"
);

export const PasswordResetIcon = createIcon(
  "M440-200h80v-120h120v-80H520v-120h-80v120H320v80h120v120Z"
);

export const PayrollIcon = createIcon(
  "M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Z"
);