import uuid

import requests
import streamlit as st

# CONFIG
FASTAPI_URL = "http://127.0.0.1:8000/chat"

st.set_page_config(page_title="ExpertAgent", page_icon="EA", layout="centered")


# INIT SESSION STATE
if "messages" not in st.session_state:
    st.session_state.messages = []

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "render_key" not in st.session_state:
    st.session_state.render_key = 0


# PAGE TITLE
st.title("ExpertAgent - AI Tutor Chat")
st.write("Ask me anything! I'm grounded in a validated curriculum and adapt to your needs.")


# CHAT MESSAGE DISPLAY
for msg in st.session_state.messages:
    role_label = "You" if msg["role"] == "user" else "ExpertAgent"
    st.markdown(f"**{role_label}:** {msg['content']}")

    if msg.get("resources_used"):
        st.markdown("### Supplemental Learning Resources")
        for r in msg["resources_used"]:
            st.write(f"- {r}")


# USER INPUT FORM
current_key = st.session_state.render_key

with st.form(key=f"chat_form_{current_key}", clear_on_submit=True):
    user_input = st.text_input("Your message:", key=f"user_input_{current_key}")
    submitted = st.form_submit_button("Send")

    if submitted and user_input.strip() != "":
        st.session_state.messages.append({"role": "user", "content": user_input})

        try:
            response = requests.post(
                FASTAPI_URL,
                json={"message": user_input, "session_id": st.session_state.session_id},
                timeout=30,
            )

            if response.status_code == 200:
                data = response.json()
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": data["reply"],
                    "resources_used": data["resources_used"],
                })
            else:
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": f"Error: {response.status_code} - {response.text}",
                    "resources_used": [],
                })

        except Exception as e:
            st.session_state.messages.append({
                "role": "assistant",
                "content": f"Connection error: {str(e)}",
                "resources_used": [],
            })

        st.session_state.render_key += 1
        st.experimental_rerun()
