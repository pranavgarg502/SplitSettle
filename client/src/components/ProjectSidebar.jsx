import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Folder, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export default function ProjectSidebar({ selectedProject, onSelectProject, open , transactionListFind}) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // manually control dropdown open

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    try {
      const res = await axios.delete(`${API_URL}/api/projects/delete/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Project deleted successfully");
        fetchProjects();
        if (selectedProject?._id === projectId) {
          onSelectProject(null);
        }
        transactionListFind();

      } else {
        toast.error(res.data.message || "Failed to delete project");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting project");
    }
  };

  const fetchProjects = async () => {
    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    try {
      const res = await axios.get(`${API_URL}/api/projects/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    try {
      const res = await axios.post(
        `${API_URL}/api/projects/create`,
        { name: name.trim(), description: description.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Project added!");
        setName("");
        setDescription("");
        fetchProjects();
      } else {
        toast.error(res.data.message || "Failed to add project");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding project");
    }
  };

  const handleProjectSelect = (proj) => {
    onSelectProject(proj);
    setDropdownOpen(false); // close dropdown
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-md z-50 p-6 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-screen w-64 fixed left-0 top-0 bg-white border-r shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6 text-green-700">SplitSettle</h1>

          {selectedProject && (
            <div className="mb-4 space-y-1 bg-white shadow-sm rounded-lg px-4 py-2 border border-gray-200 max-w-sm">
              <p className="text-sm font-semibold text-green-700">
                📁 Selected: <span className="text-gray-800">{selectedProject.name}</span>
              </p>

              {selectedProject.description && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Description:</span> {selectedProject.description}
                </p>
              )}
            </div>
          )}

          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-start mb-3" variant="outline">
                <Folder className="w-5 h-5 mr-2" /> Projects
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  className="flex items-center justify-between px-2 py-1 group hover:bg-green-50 rounded-md"
                >
                  <button
                    onClick={() => handleProjectSelect(proj)}
                    className={`text-left text-sm flex-grow truncate ${
                      selectedProject?._id === proj._id ? "font-semibold text-green-700" : ""
                    }`}
                  >
                    {proj.name}
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj._id)}
                    className="text-red-500 text-xs font-semibold px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="mb-2"
          />

          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="mb-3"
          />

          <Button onClick={handleAddProject} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>
    </div>
  );
}
