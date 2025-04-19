import React, { useState } from "react";
import GoogleIcon from "../../../assets/googleIcon.svg";
import Bing from "../../../assets/Bing.svg"
import Yahoo from "../../../assets/yahoo.svg"

const ServerSelect = ({ onServerChange }) => { // Accept onServerChange callback
  const [selectedServer, setSelectedServer] = useState("Select");

  const servers = [
    {
      name: "  Search Engine",
      icon: null,
    },
    {
      name: "Google",
      icon: GoogleIcon,
    },
    {
      name:"Bing",
      icon: Bing
    },{
      name:"Yahoo",
      icon: Yahoo
    }
  ];

  const handleChange = (event) => {
    const server = servers.find(s => s.name === event.target.value);
    setSelectedServer(server.name);
    onServerChange(server); // Call onServerChange with selected server
  };

  return (
    <div className="w-full">
      <select
        className="w-full p-1.5 rounded-xl text-white font-medium border-none
        outline-none appearance-none bg-no-repeat 
        hover:bg-[#d14e0d] transition-all duration-300"
        id="server-select"
        value={selectedServer}
        onChange={handleChange}
        style={{
          backgroundColor: "#E5590F",
          textAlign: "center",
          backgroundImage: "none",
        }}
      >
        {servers.map((server) => (
          <option
            className="rounded-lg text-gray-500 font-light bg-white text-center text-sm px-4
            transition-colors duration-200 hover:bg-gray-100"
            key={server.name}
            value={server.name}
          >
            {server.name}
          </option>
        ))}
      </select>
      {/* Removed absolute div that was causing issues */}
    </div>
  );
};

export default ServerSelect;
