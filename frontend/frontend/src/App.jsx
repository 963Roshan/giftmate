import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    otherRelation: "",
    interests: [],
    occasion: "",
    budget: "",
  });

  const [inputInterest, setInputInterest] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInterest = () => {
    if (inputInterest.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, inputInterest.trim()],
      }));
      setInputInterest("");
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.relationship) newErrors.relationship = "Relationship is required.";
    if (formData.relationship === "Other" && !formData.otherRelation)
      newErrors.otherRelation = "Please specify the relationship.";
    if (!formData.occasion) newErrors.occasion = "Occasion is required.";
    if (!formData.budget) newErrors.budget = "Budget is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("http://localhost:5000/generate", {
        name: formData.name,
        relationship:
          formData.relationship === "Other"
            ? formData.otherRelation
            : formData.relationship,
        interests: formData.interests.join(", "),
        occasion: formData.occasion,
        budget: formData.budget,
      });
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
     <h1 className="app-title">🎁 GiftMate</h1>
<p className="subtitle">AI Gift Recommender</p>
      <div className="input-card">
        <input
          type="text"
          name="name"
          placeholder="Recipient's Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <div className="error">{errors.name}</div>}

        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleInputChange}
        >
          <option value="">Select Relationship</option>
          <option value="Friend">👫 Friend</option>
          <option value="Lover">❤️ Lover</option>
          <option value="Parent">👨‍👩‍👧 Parent</option>
          <option value="Sibling">👬 Sibling</option>
          <option value="Other">❓ Other</option>
        </select>
        {errors.relationship && <div className="error">{errors.relationship}</div>}

        {formData.relationship === "Other" && (
          <>
            <input
              type="text"
              name="otherRelation"
              placeholder="Specify Relationship"
              value={formData.otherRelation}
              onChange={handleInputChange}
            />
            {errors.otherRelation && (
              <div className="error">{errors.otherRelation}</div>
            )}
          </>
        )}

        <div className="interest-section">
          <input
            type="text"
            placeholder="Add Interests"
            value={inputInterest}
            onChange={(e) => setInputInterest(e.target.value)}
          />
          <button onClick={handleAddInterest}>Add</button>
        </div>
        <div className="tags">
          {formData.interests.map((interest, index) => (
            <span key={index} className="tag">
              {interest}
              <span
                className="remove-tag"
                onClick={() => handleRemoveInterest(index)}
              >
                ×
              </span>
            </span>
          ))}
        </div>

        <input
          type="text"
          name="occasion"
          placeholder="Occasion (e.g. Birthday)"
          value={formData.occasion}
          onChange={handleInputChange}
        />
        {errors.occasion && <div className="error">{errors.occasion}</div>}

        <input
          type="text"
          name="budget"
          placeholder="Budget (e.g. 1000)"
          value={formData.budget}
          onChange={handleInputChange}
        />
        {errors.budget && <div className="error">{errors.budget}</div>}

        <button className="suggest-btn" onClick={handleSubmit}>
          🎁 Suggest Gift
        </button>
      </div>

      {loading && <p className="loading-text">Thinking of the best gift...</p>}

      {response && (
        <div className="response-box">
        {response.gift && (
          <>
            <h3 className="gift-title">🎁 {response.gift}</h3>
            <hr className="divider" />
            <p className="gift-explanation">{response.explanation}</p>
          </>
        )}
        {response.error && <p className="error-message">{response.error}</p>}
      </div>
      
      )}
    </div>
  );
}

export default App;
