import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: String,
        required: true
    }
}, { timestamps: true }); 

export default mongoose.model("Project", projectSchema);
