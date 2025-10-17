import os
import tkinter as tk
import customtkinter as ctk
from PIL import ImageTk
from dotenv import load_dotenv

import torch
from diffusers import StableDiffusionPipeline

# Load token from .env
load_dotenv()
auth_token = os.getenv("HF_TOKEN")
if not auth_token:
    raise ValueError("HF_TOKEN not found in .env file")

# Create app window
app = tk.Tk()
app.geometry("532x632")
app.title("Stable Bud (Updated)")
ctk.set_appearance_mode("dark")

prompt = ctk.CTkEntry(
    height=40,
    width=512,
    font=("Arial", 20),
    text_color="black",
    fg_color="white"
)
prompt.place(x=10, y=10)

lmain = ctk.CTkLabel(height=512, width=512)
lmain.place(x=10, y=110)

# Detect device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load model with modern API
model_id = "runwayml/stable-diffusion-v1-5"  # public & easy to run
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    use_safetensors=True,
    token=auth_token
)
pipe = pipe.to(device)

def generate():
    text = prompt.get()
    if not text.strip():
        return

    # Generate image
    image = pipe(text, guidance_scale=7.5).images[0]

    # Save and display
    image.save("generatedimage.png")
    img_tk = ImageTk.PhotoImage(image)
    lmain.configure(image=img_tk)
    lmain.image = img_tk  # Prevent garbage collection

# Button
trigger = ctk.CTkButton(
    height=40,
    width=120,
    font=("Arial", 20),
    text_color="white",
    fg_color="blue",
    command=generate,
    text="Generate"
)
trigger.place(x=206, y=60)

app.mainloop()
