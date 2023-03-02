import React, { useState } from "react";
import Input from "../../Components/Input/Input";
import supabase from "../../Config/Config";
import Button from "../../Components/Button/Button";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from("apartments").insert({
      title,
      description,
      location,
      sqft,
      monthly_price: monthlyPrice,
    });
    return (
      setTitle(""),
      setDescription(""),
      setLocation(""),
      setSqft(0),
      setMonthlyPrice("")
    );

    /* if (error) {
      console.log(error.message);
    } else {
      setTitle("");
      setDescription("");
      setLocation("");
      setSqft(0);
      setMonthlyPrice("");
    } */

    /* const onUploadFile = async (file) => {
      const { data, error } = await supabase.storage
        .from("apartments")
        .upload(file.name, file, { cacheControl: "3600", upsert: false });
      console.log(data);

      const { data: finalData } = supabase.storage
        .from("apartmants")
        .getPublicUrl(data.Key);

      console.log(finalData);
    }; */
  };
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">
        Title:
        <br />
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor="description">
        Description: <br />
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor="location">
        Location: <br />
        <Input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor="sqft">
        Sqft: <br />
        <Input
          id="sqft"
          type="number"
          min="1"
          max="infinity"
          value={sqft}
          onChange={(e) => setSqft(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor="monthly_price">
        Monthly price: <br />
        <Input
          id="monthly-price"
          type="text"
          value={monthlyPrice}
          className="monthly"
          onChange={(e) => setMonthlyPrice(e.target.value)}
        />
      </label>
      <br />
      {/* <Input type="file" onChange={(e) => onUploadFile(e.target.files[0])} /> */}
      <Button type="submit" text="Add apartment" />
    </form>
  );
};

export default Create;
