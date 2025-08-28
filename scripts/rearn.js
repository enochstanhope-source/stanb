
// List of 40 learnable items (example data with image names)
const learnables = [
  { title: 'Web Development', price: 15000, img: 'web.jpg' },
  { title: 'Graphic Design', price: 12000, img: 'digital.jpg' },
  { title: 'Digital Marketing', price: 10000, img: 'digital2.jpg' },
  { title: 'Tailoring', price: 8000, img: 'tailor.jpeg' },
  { title: 'Photography', price: 9000, img: 'photography1.jpg' },
  { title: 'Video Editing', price: 11000, img: 'hero2.jpg' },
  { title: 'UI/UX Design', price: 13000, img: 'digital.jpeg' },
  { title: 'Mobile App Dev', price: 16000, img: 'me3.jpg' },
  { title: 'Data Analysis', price: 14000, img: 'me2.jpg' },
  { title: 'Business Management', price: 9500, img: 'business.jpg' },
  { title: 'Catering', price: 7000, img: 'me4.jpg' },
  { title: 'Makeup Artistry', price: 8500, img: 'me5.jpg' },
  { title: 'Music Production', price: 12500, img: 'me6.jpg' },
  { title: 'Animation', price: 13500, img: 'me7.jpg' },
  { title: 'Fashion Design', price: 10500, img: 'me8.jpg' },
  { title: 'Interior Design', price: 11500, img: 'abouty.jpg' },
  { title: 'Event Planning', price: 9000, img: 'students.jpg' },
  { title: 'Copywriting', price: 9500, img: 'me20.jpg' },
  { title: 'Public Speaking', price: 8000, img: 'serious1.jpg' },
  { title: 'Foreign Languages', price: 10000, img: 'students.jpeg' },
  { title: 'Coding for Kids', price: 7000, img: 'aa1.jpg' },
  { title: 'Robotics', price: 17000, img: 'aa2.jpg' },
  { title: '3D Printing', price: 15500, img: 'aa3.jpg' },
  { title: 'Carpentry', price: 9000, img: 'aa4.jpg' },
  { title: 'Plumbing', price: 8500, img: 'aa5.jpg' },
  { title: 'Electrical Works', price: 9500, img: 'aa6.jpg' },
  { title: 'Auto Mechanics', price: 12000, img: 'aa7.jpg' },
  { title: 'Soap Making', price: 6000, img: 'aa8.jpg' },
  { title: 'Shoe Making', price: 7000, img: 'aa9.jpg' },
  { title: 'Bead Making', price: 6500, img: 'accc1.jpg' },
  { title: 'Painting', price: 8000, img: 'pol2.jpg' },
  { title: 'Welding', price: 10000, img: 'poly1.jpg' },
  { title: 'Barbing', price: 7500, img: 'me1.jpg' },
  { title: 'Hairdressing', price: 8000, img: 'mama1.jpg' },
  { title: 'Baking', price: 9000, img: 'mama2.jpg' },
  { title: 'Soap Production', price: 6500, img: 'seriuu.jpg' },
  { title: 'Tailoring (Advanced)', price: 12000, img: 'tailor2.jpg' },
  { title: 'Furniture Making', price: 11000, img: 'workshop.jpeg' },
  { title: 'CCTV Installation', price: 13000, img: 'g4.ico' },
  { title: 'Solar Installation', price: 14000, img: 'hero.jpg' },
];

const grid = document.getElementById('learnableGrid');
if (grid) {
  learnables.forEach(item => {
    const card = document.createElement('div');
    card.className = 'learnable-card';
    card.innerHTML = `
      <div class="learnable-img-wrap">
        <img src="images/${item.img}" alt="${item.title}" class="learnable-img" loading="lazy" />
      </div>
      <div class="learnable-title">${item.title}</div>
      <div class="learnable-price">₦${item.price.toLocaleString()}</div>
      <button class="learnable-btn">Enroll</button>
    `;
    grid.appendChild(card);
  });
}
