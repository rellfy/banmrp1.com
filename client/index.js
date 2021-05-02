function addSigner(name) {
  const ul = document.querySelector("#signers");
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(name));
  ul.appendChild(li);
}

function setSignerCount(count) {
  const element = document.querySelector("#counter");
  element.innerHTML = count;
}

async function sign(e) {
  e.preventDefault();
  const signer = document.querySelector("#signer").value;
  const response = await fetch("/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signer }),
  });
  const data = await response.json();
  if (data.error != null) {
    alert(data.error);
  } else {
    alert("thanks for making the world a better place");
  }
  window.location.reload();
}

async function loadSigners() {
  const response = await fetch("/signers");
  const signers = (await response.json()).signers;
  console.log(signers);
  signers.forEach(signer => {
    addSigner(signer);
  });
  setSignerCount(signers.length);
}

window.onload = () => {
  document.querySelector("#sign").addEventListener("submit", sign);
  loadSigners();
};
