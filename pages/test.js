import React, { Component } from "react";
import { useEffect } from "react";
import io from "socket.io-client";

function Test() {
  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });

      socket.on("hello", (data) => {
        console.log("hello", data);
      });

      socket.on("a user connected", () => {
        console.log("a user connected");
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  }, []); // Added [] as useEffect filter so it will be executed only once, when component is mounted

  return (
    <div>
      <h2>HELLO</h2>
      <p>
        Cras facilisis urna ornare ex volutpat, et convallis erat elementum. Ut
        aliquam, ipsum vitae gravida suscipit, metus dui bibendum est, eget
        rhoncus nibh metus nec massa. Maecenas hendrerit laoreet augue nec
        molestie. Cum sociis natoque penatibus et magnis dis parturient montes,
        nascetur ridiculus mus.
      </p>

      <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
    </div>
  );
}

export default Test;
