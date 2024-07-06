const container = document.getElementById("astronaut");
const numAstronauts = 1; // Số lượng phi hành gia

function createAstronaut() {
  const astronaut = document.createElement("div");
  astronaut.className = "astronaut";
  container.appendChild(astronaut);

  // Random vị trí bắt đầu và góc quay ngẫu nhiên
  let x = Math.random() * (window.innerWidth - 50); // Trừ 50 để không ra ngoài màn hình
  let y = Math.random() * (window.innerHeight - 50); // Trừ 50 để không ra ngoài màn hình
  let angle = Math.random() * 360; // Random góc quay từ 0 đến 360 độ
  const speed = 1; // Tốc độ di chuyển từ 2 đến 5 pixels per frame

  astronaut.style.left = `${x}px`;
  astronaut.style.top = `${y}px`;
  astronaut.style.transform = `rotate(${angle}deg)`;

  return { astronaut, x, y, angle, speed };
}

const astronauts = [];
for (let i = 0; i < numAstronauts; i++) {
  astronauts.push(createAstronaut());
}

function detectCollision(astronaut1, astronaut2) {
  const x1 = astronaut1.x + 25; // Tính tọa độ trung tâm của phi hành gia 1
  const y1 = astronaut1.y + 25; // Tính tọa độ trung tâm của phi hành gia 1
  const x2 = astronaut2.x + 25; // Tính tọa độ trung tâm của phi hành gia 2
  const y2 = astronaut2.y + 25; // Tính tọa độ trung tâm của phi hành gia 2

  // Tính khoảng cách giữa hai phi hành gia
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  // Kiểm tra va chạm dựa trên khoảng cách và bán kính (25px là bán kính của hình tròn)
  return distance < 50;
}

function move() {
  astronauts.forEach((a) => {
    const { astronaut, angle, speed } = a;
    // Cập nhật vị trí mới
    let newX = a.x + Math.cos((angle * Math.PI) / 180) * speed;
    let newY = a.y + Math.sin((angle * Math.PI) / 180) * speed;

    // Nếu phi hành gia va chạm với rìa màn hình, thay đổi hướng và vị trí
    if (newX < 0 || newX + 50 > window.innerWidth) {
      a.angle = (a.angle + 180) % 360;
      newX = Math.min(Math.max(newX, 0), window.innerWidth - 50);
    }
    if (newY < 0 || newY + 50 > window.innerHeight) {
      a.angle = (a.angle + 180) % 360;
      newY = Math.min(Math.max(newY, 0), window.innerHeight - 50);
    }

    // Cập nhật vị trí và góc quay
    a.x = newX;
    a.y = newY;
    astronaut.style.left = `${a.x}px`;
    astronaut.style.top = `${a.y}px`;
    astronaut.style.transform = `rotate(${a.angle}deg)`;

    // Kiểm tra va chạm với các phi hành gia khác và điều chỉnh vị trí
    astronauts.forEach((otherAstronaut) => {
      if (otherAstronaut !== a && detectCollision(a, otherAstronaut)) {
        // Tính vector từ phi hành gia 1 đến phi hành gia 2
        const deltaX = otherAstronaut.x - a.x;
        const deltaY = otherAstronaut.y - a.y;
        const angleBetween = Math.atan2(deltaY, deltaX);

        // Cập nhật góc và vị trí sau khi va chạm
        a.angle = ((angleBetween * 180) / Math.PI + 180) % 360; // Góc quay của phi hành gia 1
        otherAstronaut.angle = ((angleBetween * 180) / Math.PI + 90) % 360; // Góc quay của phi hành gia 2

        a.speed = 2 + Math.random() * 3;
        otherAstronaut.speed = 2 + Math.random() * 3;

        // Di chuyển phi hành gia ra khỏi điểm va chạm
        a.x -= Math.cos((a.angle * Math.PI) / 180) * a.speed;
        a.y -= Math.sin((a.angle * Math.PI) / 180) * a.speed;
        otherAstronaut.x -=
          Math.cos((otherAstronaut.angle * Math.PI) / 180) *
          otherAstronaut.speed;
        otherAstronaut.y -=
          Math.sin((otherAstronaut.angle * Math.PI) / 180) *
          otherAstronaut.speed;

        // Cập nhật vị trí mới để phi hành gia không dính vào nhau
        a.x = Math.max(0, Math.min(a.x, window.innerWidth - 50));
        a.y = Math.max(0, Math.min(a.y, window.innerHeight - 50));
        otherAstronaut.x = Math.max(
          0,
          Math.min(otherAstronaut.x, window.innerWidth - 50)
        );
        otherAstronaut.y = Math.max(
          0,
          Math.min(otherAstronaut.y, window.innerHeight - 50)
        );

        // Đảm bảo không có sự va chạm lại ngay lập tức
        astronaut.style.transition = "none"; // Tắt transition khi đổi vị trí
        otherAstronaut.astronaut.style.transition = "none"; // Tắt transition khi đổi vị trí
        setTimeout(() => {
          astronaut.style.transition = "transform 0.2s linear"; // Bật lại transition
          otherAstronaut.astronaut.style.transition = "transform 0.2s linear"; // Bật lại transition
        }, 10);
      }
    });
  });
  requestAnimationFrame(move);
}

move();
