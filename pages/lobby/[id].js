// TODO The individual session lobby page lives here
import React, { Component } from "react";
import { useRouter } from "next/router";
import { useState } from "react";

// TODO the initial game object with users should be marked with some started:False flag

function Test() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  // TODO make sure the fetched game id is valid

  const addUser = async () => {
    // grab the text box's information
    // and then fire an http request
    const res = await fetch(`/api/add-user?username=${username}`);
    console.log(res);
  };

  return (
    <div>
      <h2>HELLO THIS IS THE LOBBY</h2>
      <h3>{router.query.id}</h3>
      <p>
        Cras facilisis urna ornare ex volutpat, et convallis erat elementum. Ut
        aliquam, ipsum vitae gravida suscipit, metus dui bibendum est, eget
        rhoncus nibh metus nec massa. Maecenas hendrerit laoreet augue nec
        molestie. Cum sociis natoque penatibus et magnis dis parturient montes,
        nascetur ridiculus mus.
      </p>

      <input
        id="text_box"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      ></input>
      <button onClick={addUser}>Fire</button>
      <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
    </div>
  );
}

export default Test;
