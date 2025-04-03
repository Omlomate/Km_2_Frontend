import React, { useState } from "react";
import GoogleIcon from "../../../assets/googleIcon.svg";
import Bing from "../../../assets/Bing.svg"
import Yahoo from "../../../assets/yahoo.svg"

const ServerSelect = ({ onServerChange }) => { // Accept onServerChange callback
  const [selectedServer, setSelectedServer] = useState("Select");

  const servers = [
    {
      name: "Select Search Engine",
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
    <div>
      <select
        className="p-1.5 rounded-xl text-[#12153d] font-light border-2 border-gray-50 
        outline-none flex-grow appearance-none bg-no-repeat 
        hover:shadow-[0_0_15px_rgba(229,89,15,0.3)] 
        hover:border-[#E5590F]
        focus:shadow-[0_0_20px_rgba(229,89,15,0.4)]
        focus:border-[#E5590F]"
        id="server-select"
        value={selectedServer}
        onChange={handleChange}
        style={{
          backgroundColor: "#E5590F",
          textAlign: "center",
          backgroundImage: "none",
          width: "160px",
        }}
      >
        {servers.map((server) => (
          <option
            className="rounded-lg text-gray-500 font-light bg-white text-center text-sm
            transition-colors duration-200 hover:bg-gray-100"
            key={server.name}
            value={server.name}
          >
            {/* <img src={server.icon} alt={`${server.name} icon`} style={{ display: 'inline', marginRight: '8px' }} /> */}
            {server.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-0 rounded-xl bg-[#E5590F]/10 
        transform scale-0 transition-transform duration-300 ease-out 
        group-hover:scale-100 -z-10"></div>
    </div>
  );
};

export default ServerSelect;
