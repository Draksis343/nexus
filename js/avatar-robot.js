// NEXUS ARENA · avatar-robot
// Avatares robot: catálogo de piezas, dibujo SVG, animación, creador «Mi avatar» y piezas navideñas.
// Se carga en orden desde index.html; comparte variables globales con los demás archivos.
// ===== AVATARES ROBOT (2.5D, SVG) =====
const RB=(()=>{
const h2r=h=>{h=String(h||'#000').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16)||0;return[n>>16&255,n>>8&255,n&255]};
const r2h=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
function hsl(h){let[r,g,b]=h2r(h).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H=0,S=0,L=(mx+mn)/2;if(mx!==mn){const d=mx-mn;S=L>.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;H/=6}return[H,S,L]}
function fromHsl(H,S,L){const f=n=>{const k=(n+H*12)%12,a=S*Math.min(L,1-L);return L-a*Math.max(-1,Math.min(k-3,9-k,1))};return r2h(f(0)*255,f(8)*255,f(4)*255)}
const sh=(c,p)=>{const[H,S,L]=hsl(c);return fromHsl(H,S,Math.max(0,Math.min(1,L+p/100)))};
const mix=(a,b,t)=>{const A=h2r(a),B=h2r(b);return r2h(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t)};
const lum=c=>hsl(c)[2];
const MD=d=>d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g,(m,x,y)=>`${+(400-x).toFixed(1)} ${y}`);
const HEX=/^#[0-9a-f]{6}$/i;
// ---- trazos de pantalla
const S=(d,c,w=7)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const Fi=(d,c)=>`<path d="${d}" fill="${c}"/>`;
const heart='M0 12C-14 2 -18 -6 -14 -11C-10 -15 -3 -13 0 -7C3 -13 10 -15 14 -11C18 -6 14 2 0 12Z';
const starD=(R,r)=>'M'+[...Array(10)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;return`${(Math.cos(a)*q).toFixed(1)} ${(Math.sin(a)*q).toFixed(1)}`}).join('L')+'Z';
const flake=(c,r,w)=>[0,60,120].map(a=>`<path d="M0 ${-r}L0 ${r}M-4 ${-r+4}L0 ${-r+8}L4 ${-r+4}M-4 ${r-4}L0 ${r-8}L4 ${r-4}" transform="rotate(${a})" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
// ---- catálogo: [nombre, dibujo, navideño]
const EYES=[
 ['Puntos',c=>`<circle r="10" fill="${c}"/>`],
 ['Grandes',c=>`<ellipse rx="16" ry="18" fill="${c}"/><ellipse cx="-5" cy="-7" rx="5" ry="4" fill="#fff" opacity=".55"/>`],
 ['Líneas',c=>S('M-17 0L17 0',c)],
 ['Felices',c=>S('M-16 5C-12 -10 12 -10 16 5',c)],
 ['Medias lunas',c=>Fi('M-17 5C-17 -15 17 -15 17 5Z',c)],
 ['Dormidos',c=>Fi('M-17 -4L17 -4C17 14 -17 14 -17 -4Z',c)],
 ['Enojados',c=>Fi('M-17 -2L17 -13C17 6 7 12 -2 10C-11 8 -17 4 -17 -2Z',c)],
 ['Círculos',c=>`<circle r="13" fill="none" stroke="${c}" stroke-width="6"/>`],
 ['Pequeños',c=>`<circle r="6" fill="none" stroke="${c}" stroke-width="5"/>`],
 ['Apretados',c=>S('M12 -11L-10 0L12 11',c)],
 ['Llorando',c=>S('M-15 -10L15 -10M0 -10L0 14',c)],
 ['Corazones',c=>Fi(heart,c)],
 ['LED',c=>`<rect x="-11" y="-16" width="22" height="32" rx="7" fill="${c}"/>`],
 ['Afilados',c=>`<path d="M-15 -9L16 4L-7 9Z" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`],
 ['KO',c=>S('M-11 -11L11 11M11 -11L-11 11',c)],
 ['Estrellas',c=>Fi(starD(16,7),c)],
 ['Fastidio',c=>S('M-17 -8L17 -8',c,6)+Fi('M-4 -8C-4 6 14 6 14 -8Z',c)],
 ['Mareados',c=>S('M1 0C5 -2 7 4 3 7C-3 10 -9 4 -7 -2C-5 -10 7 -12 12 -4C16 4 12 14 2 16',c,5)],
 ['Copos',c=>flake(c,15,4),1],
 ['Arbolitos',c=>Fi('M0 -17L12 0L6 0L15 12L-15 12L-6 0L-12 0Z',c)+`<circle cy="-18" r="3" fill="${c}"/>`,1],
 ['Bastones',c=>S('M4 16L4 -6C4 -16 -10 -16 -10 -6',c,6),1],
 ['Regalos',c=>`<rect x="-13" y="-8" width="26" height="22" rx="3" fill="none" stroke="${c}" stroke-width="4.5"/>`+S('M0 -8L0 14M-13 2L13 2',c,4)+S('M0 -8C-6 -16 -12 -12 -8 -8M0 -8C6 -16 12 -12 8 -8',c,3.5),1],
 ['Esferas',c=>`<circle cy="3" r="13" fill="${c}"/><rect x="-5" y="-15" width="10" height="6" rx="2" fill="${c}"/>`+S('M-9 2C-4 6 4 6 9 2',c==='#000'?'#fff':'#0008',2.5),1]];
const MOUTHS=[
 ['Ninguna',()=>''],
 ['Gatito',c=>S('M-16 -3C-14 8 -4 8 0 0C4 8 14 8 16 -3',c,6)],
 ['Conejito',c=>Fi('M-4 -10L4 -10L0 -5Z',c)+S('M-11 -1C-9 6 -2 6 0 -1C2 6 9 6 11 -1',c,5)],
 ['Sonrisa',c=>S('M-15 -4C-8 9 8 9 15 -4',c)],
 ['Feliz',c=>Fi('M-15 -5L15 -5C15 13 -15 13 -15 -5Z',c)],
 ['Beso',c=>S('M-4 -12C6 -12 8 -4 0 -2C8 0 6 10 -4 10',c,6)],
 ['Lengua',c=>S('M-13 -4C-7 4 7 4 13 -4',c,6)+S('M-4 2C-4 12 6 12 6 2',c,5)],
 ['Línea',c=>S('M-12 0L12 0',c)],
 ['Sorpresa',c=>`<ellipse rx="7" ry="9" fill="none" stroke="${c}" stroke-width="5"/>`],
 ['Grito',c=>`<path d="M-10 10L-10 0C-10 -11 10 -11 10 0L10 10Z" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`],
 ['Enojo',c=>S('M-12 6C-6 -6 6 -6 12 6',c)],
 ['Triángulo',c=>`<path d="M0 -9L9 8L-9 8Z" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`],
 ['Zigzag',c=>S('M-15 2L-7 -4L0 2L7 -4L15 2',c,5)],
 ['Colmillo',c=>S('M-15 -4C-8 7 8 7 15 -4',c,6)+Fi('M4 2L10 0L7 9Z',c)],
 ['Pícaro',c=>S('M-12 6L12 -3',c)],
 ['Dientes',c=>`<path d="M-13 8L-13 -6L-6 2L0 -9L6 2L13 -6L13 8Z" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`],
 ['Bigote navideño',c=>Fi('M0 -4C-6 -12 -22 -10 -26 2C-18 -2 -10 0 0 4C10 0 18 -2 26 2C22 -10 6 -12 0 -4Z',c)+S('M-6 12C-2 15 2 15 6 12',c,4),1],
 ['Carbones',c=>[-14,-7,0,7,14].map((x,i)=>`<circle cx="${x}" cy="${[-2,3,5,3,-2][i]}" r="3.4" fill="${c}"/>`).join(''),1],
 ['Glaseado',c=>S('M-16 0C-12 -6 -8 6 -4 0C0 -6 4 6 8 0C12 -6 16 6 18 0',c,4.5),1]];
const DETS=[['rubor','Sonrojo'],['lagrimas','Lágrimas'],['vena','Enojo'],['sudor','Sudor'],['brillos','Destellos']];
// módulos de la cabeza: devuelven {b: detrás del casco, f: delante}
const TOPS=[
 ['Ninguno',()=>({})],
 ['Orejas de conejo',k=>{const E='M148 112C120 80 104 30 124 6C144 -16 184 -2 192 40C196 66 196 92 190 108Z',I='M154 98C138 74 130 42 138 26C146 12 170 18 174 44C178 64 178 84 174 98Z';
  const ear=t=>`<g transform="${t}"><path d="${E}" fill="${k.u('top')}"/><path d="${I}" fill="${k.u('lt')}" opacity=".95"/><path d="M134 18C140 10 152 8 160 14" fill="none" stroke="#fff" stroke-width="3" opacity="${k.hi*.6}" stroke-linecap="round"/><rect x="176" y="60" width="6" height="18" rx="2" fill="${k.Bd}" opacity=".9"/></g>`;
  return{b:ear('rotate(-6 170 104)')+`<g transform="translate(400 0) scale(-1 1)">${ear('rotate(-12 170 104)')}</g>`}}],
 ['Orejas de gato',k=>{const E='M132 128L112 44C136 52 166 76 180 100Z',I='M136 114L124 64C140 72 156 86 164 100Z';return{b:`<path d="${E}" fill="${k.u('top')}"/><path d="${I}" fill="${k.u('lt')}"/><path d="${MD(E)}" fill="${k.u('top')}"/><path d="${MD(I)}" fill="${k.u('lt')}"/>`}}],
 ['Cables',k=>{const t=(d,w=17)=>k.tube(d,w),e=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="${k.L}"/>`;
  return{b:['M150 104C118 82 80 92 62 132','M250 104C282 82 320 92 338 132','M134 124C92 124 60 164 58 214','M266 124C308 124 340 164 342 214','M124 156C84 176 66 222 74 266','M276 156C316 176 334 222 326 266'].map(q=>t(q)).join('')+k.glow(e(62,132)+e(338,132)+e(58,214)+e(342,214)+e(74,266)+e(326,266)),
   f:['M168 92C150 60 120 56 104 76','M200 86C202 52 190 30 166 24','M232 92C252 60 286 56 298 80','M186 94C198 66 228 52 252 56'].map(q=>t(q,19)).join('')+k.glow(e(104,76)+e(166,24)+e(298,80)+e(252,56))}}],
 ['Antenas',k=>({b:`<path d="M172 86L148 20M228 86L252 20" stroke="${k.Bd}" stroke-width="7" stroke-linecap="round"/>`+k.glow(`<circle cx="148" cy="18" r="10" fill="${k.L}"/><circle cx="252" cy="18" r="10" fill="${k.L}"/>`)+`<circle cx="145" cy="15" r="3" fill="#fff" opacity=".8"/><circle cx="249" cy="15" r="3" fill="#fff" opacity=".8"/>`})],
 ['Cuernos',k=>{const H='M148 102C126 76 112 42 120 8C136 40 160 66 180 88Z',r=(x,y)=>`M${x-10} ${y+6}C${x-2} ${y+2} ${x+8} ${y+4} ${x+14} ${y+10}`;return{b:`<path d="${H}" fill="${k.u('top')}"/><path d="${MD(H)}" fill="${k.u('top')}"/>`+[[136,70],[126,44]].map(([x,y])=>`<path d="${r(x,y)}" fill="none" stroke="${k.L}" stroke-width="3"/><path d="${MD(r(x,y))}" fill="none" stroke="${k.L}" stroke-width="3"/>`).join('')}}],
 ['Alas',k=>{const W1='M118 140C70 112 38 62 44 8C82 38 114 88 134 128Z',W2='M108 168C64 160 30 128 22 92C62 102 98 126 122 154Z',w=d=>`<path d="${d}" fill="${k.L}" opacity=".32"/><path d="${d}" fill="${k.u('hx')}" opacity=".6"/>`+k.glow(`<path d="${d}" fill="none" stroke="${sh(k.L,18)}" stroke-width="2.5"/>`);return{b:w(W1)+w(W2)+w(MD(W1))+w(MD(W2))}}],
 ['Cresta',k=>({b:[[160,58,26],[200,40,30],[240,58,26]].map(([x,h,w])=>`<path d="M${x-w/2} 96C${x-w/2} 70 ${x-6} ${h} ${x} ${h-10}C${x+6} ${h} ${x+w/2} 70 ${x+w/2} 96Z" fill="${k.u('top')}"/><path d="M${x} ${h}L${x} 90" stroke="${k.L}" stroke-width="3"/>`).join('')})],
 ['Aletas',k=>{const Bk='M136 116C112 92 70 46 30 30C40 64 80 104 122 132Z',T='M30 30C40 64 60 84 80 98C64 70 48 50 30 30Z';return{b:`<path d="${Bk}" fill="${k.u('top')}"/><path d="${T}" fill="${k.L}"/><path d="${MD(Bk)}" fill="${k.u('top')}"/><path d="${MD(T)}" fill="${k.L}"/>`+k.glow(`<circle cx="132" cy="118" r="12" fill="${k.L}"/><circle cx="268" cy="118" r="12" fill="${k.L}"/>`)}}],
 ['Antena',k=>({b:`<path d="M214 80C216 50 222 30 236 12" fill="none" stroke="${k.Bd}" stroke-width="6" stroke-linecap="round"/>`+k.glow(`<circle cx="238" cy="10" r="9" fill="${k.L}"/>`)+`<rect x="204" y="72" width="22" height="10" rx="4" fill="${k.u('top')}"/>`})],
 ['Orejas de oso',k=>({b:[118,282].map(x=>`<circle cx="${x}" cy="96" r="34" fill="${k.u('top')}"/><circle cx="${x}" cy="96" r="18" fill="${k.u('lt')}"/>`).join('')})],
 ['Orejas de zorro',k=>{const E='M140 116C120 70 112 30 120 0C150 24 176 64 186 96Z',I='M146 100C134 70 130 44 132 24C148 42 162 66 168 90Z';return{b:`<path d="${E}" fill="${k.u('top')}"/><path d="${I}" fill="${k.u('lt')}"/><path d="M120 0C124 14 128 22 134 30C128 20 124 10 120 0Z" fill="#fff" opacity=".8"/><path d="${MD(E)}" fill="${k.u('top')}"/><path d="${MD(I)}" fill="${k.u('lt')}"/>`}}],
 ['Hélice',k=>({b:`<rect x="194" y="46" width="12" height="32" rx="4" fill="${k.Bd}"/><g class="rb-spin" style="transform-origin:200px 44px"><path d="M200 44C176 30 136 32 120 44C136 56 176 58 200 44C224 30 264 32 280 44C264 56 224 58 200 44Z" fill="${k.u('top')}"/><path d="M200 44C224 30 264 32 280 44" fill="none" stroke="${k.L}" stroke-width="3"/></g><circle cx="200" cy="44" r="8" fill="${k.L}"/>`})],
 ['Púas',k=>({b:[[128,112,-36],[154,92,-18],[200,82,0],[246,92,18],[272,112,36]].map(([x,y,a])=>`<path d="M${x-12} ${y+10}L${x} ${y-34}L${x+12} ${y+10}Z" fill="${k.u('top')}" transform="rotate(${a} ${x} ${y})"/><path d="M${x} ${y-30}L${x} ${y+4}" stroke="${k.L}" stroke-width="2" opacity=".8" transform="rotate(${a} ${x} ${y})"/>`).join('')})],
 ['Paneles',k=>({b:[[140,-22],[260,22]].map(([x,a])=>`<g transform="rotate(${a} ${x} 90)"><rect x="${x-4}" y="60" width="8" height="32" fill="${k.Bd}"/><rect x="${x-26}" y="10" width="52" height="54" rx="5" fill="${k.u('top')}"/><rect x="${x-21}" y="15" width="42" height="44" rx="3" fill="${mix(k.L,'#0c1430',.7)}"/><path d="M${x-21} 30L${x+21} 30M${x-21} 44L${x+21} 44M${x} 15L${x} 59" stroke="${k.L}" stroke-width="1.5" opacity=".8"/></g>`).join('')})],
 ['Anillo orbital',k=>({b:`<path d="M40 150C40 116 360 116 360 150" fill="none" stroke="${k.L}" stroke-width="7" opacity=".5"/>`,f:k.glow(`<path d="M360 150C360 184 40 184 40 150" fill="none" stroke="${k.L}" stroke-width="7"/>`)+`<circle cx="352" cy="164" r="7" fill="#fff" opacity=".85"/>`})],
 ['Fibras neón',k=>({b:k.glow([[170,-30],[186,-14],[200,0],[214,14],[230,30]].map(([x,a])=>`<path d="M${x} 84C${x-4} 54 ${x+a*.6} 30 ${x+a} 10" fill="none" stroke="${k.L}" stroke-width="4" stroke-linecap="round"/><circle cx="${x+a}" cy="10" r="5" fill="#fff"/>`).join(''))})],
 ['Cuernos de reno',k=>{const br='#7a4a2a',a='M162 98C150 70 142 48 128 26M146 64C130 60 118 52 108 38M138 46C146 34 150 22 148 8M132 34C122 30 114 22 110 10';return{b:`<path d="${a}" fill="none" stroke="${br}" stroke-width="10" stroke-linecap="round"/><path d="${MD(a)}" fill="none" stroke="${br}" stroke-width="10" stroke-linecap="round"/><path d="${a}" fill="none" stroke="#a86c42" stroke-width="3" stroke-linecap="round" transform="translate(-2 -2)"/><path d="${MD(a)}" fill="none" stroke="#a86c42" stroke-width="3" stroke-linecap="round" transform="translate(-2 -2)"/>`}},1],
 ['Antena de copo',k=>({b:`<path d="M200 80L200 34" stroke="${k.Bd}" stroke-width="6" stroke-linecap="round"/>`+k.glow(`<g transform="translate(200 24)">${flake('#e9f7ff',18,4)}</g>`)}),1],
 ['Mini árbol',k=>({b:`<rect x="194" y="56" width="12" height="24" fill="#7a4a2a"/><path d="M200 -6L232 40L216 40L240 66L160 66L184 40L168 40Z" fill="#2e8b57"/><path d="M200 -6L232 40L216 40L200 18Z" fill="#3fae6e"/>`+k.glow(`<path d="${starD(10,4)}" transform="translate(200 -8)" fill="#ffd36b"/><circle cx="186" cy="50" r="4" fill="#ff3b2f"/><circle cx="214" cy="58" r="4" fill="#73dbe4"/><circle cx="206" cy="30" r="4" fill="#ffc266"/>`)}),1],
 ['Orejas de elfo',k=>{const E='M86 176C60 160 36 132 22 106C50 112 76 132 92 150Z';return{b:`<path d="${E}" fill="${k.u('top')}"/><path d="${MD(E)}" fill="${k.u('top')}"/><path d="M80 166C62 150 46 132 38 118" fill="none" stroke="${k.L}" stroke-width="3"/><path d="${MD('M80 166C62 150 46 132 38 118')}" fill="none" stroke="${k.L}" stroke-width="3"/>`}},1]];
// accesorios de cabeza (encima de todo)
const SHD=(d,k)=>`<path d="${d}" fill="#000" opacity=".32" clip-path="${k.u('hc')}"/>`;
const HEADS=[
 ['Ninguno',()=>''],
 ['Audífonos',k=>k.phones(0)],
 ['Audífonos gamer',k=>k.phones(1)],
 ['Gorra',k=>SHD('M70 168C120 154 280 154 330 168L330 192C280 178 120 178 70 192Z',k)+`<path d="M82 160C78 100 132 60 200 60C268 60 322 100 318 160Z" fill="${k.u('acc')}"/><path d="M200 62L200 156M200 62L150 158M200 62L250 158" stroke="${k.ad}" stroke-width="2" opacity=".55"/><circle cx="200" cy="62" r="7" fill="${k.ad}"/><path d="M72 152C126 134 274 134 328 152C338 172 282 186 200 186C118 186 62 172 72 152Z" fill="${k.ad}"/><path d="M72 152C126 134 274 134 328 152" fill="none" stroke="${k.al}" stroke-width="3" opacity=".6"/><g transform="translate(200 110)"><path d="M0 -15L12 0L0 15L-12 0Z" fill="#fff" opacity=".92"/>${k.glow(`<path d="M0 -7L6 0L0 7L-6 0Z" fill="${k.L}"/>`)}</g><path d="M110 104C126 80 160 66 192 64" fill="none" stroke="#fff" stroke-width="6" opacity="${k.hi*.4}" stroke-linecap="round"/>`],
 ['Gorro',k=>SHD('M68 178C110 160 290 160 332 178L332 196C290 178 110 178 68 196Z',k)+`<path d="M80 166C76 104 130 60 200 60C270 60 324 104 320 166Z" fill="${k.u('acc')}"/><path d="M72 152C110 134 290 134 328 152L330 182C290 164 110 164 70 182Z" fill="${k.ad}"/>${[...Array(14)].map((_,i)=>{const x=84+i*17.5,t=(x-200)/130,y=152-14*(1-t*t);return`<path d="M${x.toFixed(1)} ${(y+3).toFixed(1)}L${x.toFixed(1)} ${(y+26).toFixed(1)}" stroke="${sh(k.A,-30)}" stroke-width="2.4" opacity=".55"/>`}).join('')}<circle cx="200" cy="52" r="17" fill="${k.al}"/><circle cx="194" cy="46" r="6" fill="#fff" opacity=".35"/><path d="M110 112C126 86 160 70 194 68" fill="none" stroke="#fff" stroke-width="6" opacity="${k.hi*.35}" stroke-linecap="round"/>`],
 ['Corona',k=>SHD('M134 118C160 106 240 106 266 118L266 130C240 118 160 118 134 130Z',k)+`<path d="M134 106L128 62L158 86L180 52L200 80L220 52L242 86L272 62L266 106C240 94 160 94 134 106Z" fill="#ffd36b" stroke="#c8902e" stroke-width="3" stroke-linejoin="round"/><path d="M132 102C160 90 240 90 268 102L266 122C240 110 160 110 134 122Z" fill="#f0b43c" stroke="#c8902e" stroke-width="3"/>`+k.glow(`<circle cx="200" cy="108" r="6" fill="${k.L}"/>`)+`<circle cx="162" cy="110" r="4" fill="#ff3b2f"/><circle cx="238" cy="110" r="4" fill="#73dbe4"/><circle cx="180" cy="52" r="4" fill="#fff"/><circle cx="220" cy="52" r="4" fill="#fff"/>`],
 ['Halo',k=>k.glow(`<ellipse cx="200" cy="40" rx="84" ry="18" fill="none" stroke="${k.L}" stroke-width="7"/>`)+`<ellipse cx="200" cy="40" rx="84" ry="18" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>`],
 ['Visor holográfico',k=>`<path d="M86 176C120 156 280 156 314 176L312 204C280 188 120 188 88 204Z" fill="${k.L}" opacity=".35"/>`+k.glow(`<path d="M86 176C120 156 280 156 314 176" fill="none" stroke="${sh(k.L,18)}" stroke-width="3"/><path d="M120 190L280 190" stroke="${k.L}" stroke-width="2" stroke-dasharray="10 6"/>`)],
 ['Goggles',k=>`<path d="M74 140C120 116 280 116 326 140L326 156C280 132 120 132 74 156Z" fill="${k.ad}"/>${[160,240].map(x=>`<circle cx="${x}" cy="118" r="28" fill="${k.hc}"/><circle cx="${x}" cy="118" r="20" fill="${mix(k.L,'#000',.45)}"/><circle cx="${x}" cy="118" r="20" fill="none" stroke="${k.L}" stroke-width="2.5"/><ellipse cx="${x-7}" cy="110" rx="7" ry="4" fill="#fff" opacity=".5"/>`).join('')}`],
 ['Boina',k=>SHD('M72 166C120 154 280 154 328 166L328 186C280 172 120 172 72 186Z',k)+`<path d="M62 160C50 108 112 58 210 56C308 56 354 96 342 140C332 164 290 158 200 160C120 162 74 172 62 160Z" fill="${k.u('acc')}"/><path d="M74 154C120 142 280 142 326 154L324 172C280 160 120 160 76 172Z" fill="${k.ad}"/><path d="M214 56L222 40L232 52Z" fill="${k.ad}"/><path d="M96 110C120 80 170 64 220 62" fill="none" stroke="#fff" stroke-width="6" opacity="${k.hi*.35}" stroke-linecap="round"/>`],
 ['Sombrero',k=>SHD('M70 156C120 140 280 140 330 156L330 176C280 160 120 160 70 176Z',k)+`<path d="M118 112C118 70 156 50 200 60C244 50 282 70 282 112Z" fill="${k.u('acc')}"/><path d="M116 98C150 90 250 90 284 98L284 116C250 108 150 108 116 116Z" fill="#15171c"/><path d="M36 134C80 104 320 104 364 134C368 154 300 164 200 164C100 164 32 154 36 134Z" fill="${k.ad}"/><path d="M36 134C80 104 320 104 364 134" fill="none" stroke="${k.al}" stroke-width="3" opacity=".6"/>`],
 ['Bandana',k=>SHD('M74 166C120 152 280 152 326 166L326 184C280 170 120 170 74 184Z',k)+`<path d="M78 164C72 102 128 62 200 62C272 62 328 102 322 164C280 150 120 150 78 164Z" fill="${k.u('acc')}"/>${[...Array(8)].map((_,i)=>`<circle cx="${110+i*26}" cy="${118-Math.sin(i/7*Math.PI)*30}" r="3.5" fill="#fff" opacity=".6"/>`).join('')}<path d="M318 150C338 150 352 160 362 178L346 186C340 172 330 166 318 164Z" fill="${k.ad}"/><path d="M322 152C344 140 360 138 372 144L366 160C352 156 338 158 324 162Z" fill="${k.ad}"/>`],
 ['Gorra atrás',k=>SHD('M70 168C120 154 280 154 330 168L330 188C280 174 120 174 70 188Z',k)+`<path d="M82 162C78 100 132 60 200 60C268 60 322 100 318 162Z" fill="${k.u('acc')}"/><path d="M150 64C170 50 230 50 250 64L246 74C226 62 174 62 154 74Z" fill="${k.ad}"/><path d="M160 150C176 140 224 140 240 150L236 164C222 156 178 156 164 164Z" fill="${k.ad}"/><rect x="190" y="146" width="20" height="10" rx="3" fill="url(#§mt)"/>`],
 ['Diadema LED',k=>`<path d="M84 160C90 94 142 64 200 64C258 64 310 94 316 160" fill="none" stroke="${k.Bd}" stroke-width="10" stroke-linecap="round"/>`+k.glow([...Array(9)].map((_,i)=>{const a=Math.PI*(1-i/8),x=200+Math.cos(a)*112,y=162-Math.sin(a)*94;return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${k.L}"/>`}).join(''))],
 ['Lentes de sol',k=>`<path d="M108 196C120 184 180 184 190 196C192 222 176 234 150 234C124 234 106 222 108 196Z" fill="#0b0b10" opacity=".92"/><path d="${MD('M108 196C120 184 180 184 190 196C192 222 176 234 150 234C124 234 106 222 108 196Z')}" fill="#0b0b10" opacity=".92"/><path d="M190 198L210 198" stroke="${k.hc}" stroke-width="5"/><path d="M118 196C130 190 150 190 160 194L126 222Z" fill="#fff" opacity=".18"/><path d="M282 196C270 190 250 190 240 194L274 222Z" fill="#fff" opacity=".12"/>`],
 ['Monóculo',k=>`<circle cx="248" cy="212" r="26" fill="${k.L}" opacity=".14"/>`+k.glow(`<circle cx="248" cy="212" r="26" fill="none" stroke="${k.L}" stroke-width="4"/>`)+`<path d="M272 222C292 246 296 270 286 296" fill="none" stroke="url(#§mt)" stroke-width="2.5" stroke-dasharray="4 3"/>`],
 ['Auricular',k=>`<path d="M326 160C330 110 290 70 240 62" fill="none" stroke="${k.Bd}" stroke-width="9" stroke-linecap="round"/><rect x="302" y="168" width="44" height="64" rx="20" fill="${k.u('bulb')}"/>`+k.glow(`<rect x="309" y="176" width="30" height="48" rx="14" fill="none" stroke="${k.L}" stroke-width="3"/>`)+`<path d="M318 226C300 268 270 286 230 290" fill="none" stroke="${k.Bd}" stroke-width="5" stroke-linecap="round"/>`+k.glow(`<circle cx="228" cy="290" r="6" fill="${k.L}"/>`)],
 ['Visera',k=>`<path d="M84 160C90 96 142 66 200 66C258 66 310 96 316 160" fill="none" stroke="${k.ad}" stroke-width="12" stroke-linecap="round"/><path d="M80 152C130 134 270 134 320 152C330 172 280 184 200 184C120 184 70 172 80 152Z" fill="${k.u('acc')}"/><path d="M80 152C130 134 270 134 320 152" fill="none" stroke="${k.al}" stroke-width="3" opacity=".7"/>`+k.glow(`<path d="M150 160L250 160" stroke="${k.L}" stroke-width="3"/>`)],
 ['Gorro de Santa',k=>SHD('M66 182C110 164 290 164 334 182L334 200C290 182 110 182 66 200Z',k)+`<path d="M82 164C72 100 124 54 204 52C262 50 310 66 336 104C352 128 360 156 364 178C346 160 330 146 318 140C322 150 322 160 320 166Z" fill="#e3262e"/><path d="M236 58C290 64 330 96 352 150C334 116 300 86 252 74Z" fill="#b5161d" opacity=".7"/><path d="M110 108C130 82 166 66 200 64" fill="none" stroke="#fff" stroke-width="6" opacity=".25" stroke-linecap="round"/><path d="M68 154C110 132 290 132 332 154L336 188C290 166 110 166 64 188Z" fill="#f4f6fa"/>${[...Array(12)].map((_,i)=>{const x=74+i*23,t=(x-200)/132;return`<circle cx="${x}" cy="${(186-22*(1-t*t)).toFixed(1)}" r="9" fill="#f4f6fa"/>`}).join('')}<path d="M68 154C110 132 290 132 332 154" fill="none" stroke="#fff" stroke-width="5"/><circle cx="364" cy="184" r="19" fill="#f4f6fa"/><circle cx="358" cy="178" r="7" fill="#fff"/>`,1],
 ['Diadema de reno',k=>{const a='M150 86C142 62 136 44 124 26M140 56C128 54 118 48 110 38M134 42C140 32 142 22 140 12';return`<path d="M84 160C90 94 142 64 200 64C258 64 310 94 316 160" fill="none" stroke="#7a4a2a" stroke-width="9" stroke-linecap="round"/><path d="${a}" fill="none" stroke="#a86c42" stroke-width="8" stroke-linecap="round"/><path d="${MD(a)}" fill="none" stroke="#a86c42" stroke-width="8" stroke-linecap="round"/><path d="M110 92C92 90 80 100 76 112C92 112 104 106 114 98Z" fill="#a86c42"/><path d="${MD('M110 92C92 90 80 100 76 112C92 112 104 106 114 98Z')}" fill="#a86c42"/>`+k.glow(`<circle cx="200" cy="64" r="7" fill="#ff3b2f"/>`)},1],
 ['Gorro de elfo',k=>SHD('M70 176C114 160 286 160 330 176L330 194C286 178 114 178 70 194Z',k)+`<path d="M84 166C80 116 116 74 168 62C222 46 270 22 302 -2C292 42 302 94 316 166Z" fill="#2e8b57"/><path d="M168 62C222 46 270 22 302 -2C296 30 298 60 304 92C280 70 236 62 190 70Z" fill="#3fae6e" opacity=".6"/><path d="M72 154C112 136 288 136 328 154L330 182C288 164 112 164 70 182Z" fill="#e3262e"/>${[0,1,2,3,4,5,6,7].map(i=>{const x=86+i*32,t=(x-200)/130;return`<path d="M${x} ${(156-14*(1-t*t)).toFixed(1)}L${x+16} ${(156-14*(1-((x+16-200)/130)**2)).toFixed(1)}L${x+16} ${(184-14*(1-((x+16-200)/130)**2)).toFixed(1)}L${x} ${(184-14*(1-t*t)).toFixed(1)}Z" fill="#fff" opacity=".85"/>`}).join('')}`+k.glow(`<circle cx="302" cy="-2" r="10" fill="#ffd36b"/>`),1],
 ['Corona de acebo',k=>{let s='';for(let i=0;i<11;i++){const a=Math.PI*(1-i/10),x=200+Math.cos(a)*118,y=150-Math.sin(a)*80,r=(a*180/Math.PI-90).toFixed(0);s+=`<path d="M0 -14C8 -10 6 -4 12 0C6 4 8 10 0 14C-8 10 -6 4 -12 0C-6 -4 -8 -10 0 -14Z" fill="${i%2?'#2e8b57':'#3fae6e'}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r})"/>`}
  return s+k.glow([[150,82],[200,70],[250,82],[110,110],[290,110]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#ff3b2f"/>`).join(''))},1],
 ['Orejeras',k=>`<path d="M68 196C68 100 130 60 200 60C270 60 332 100 332 196" fill="none" stroke="#e3262e" stroke-width="12"/>`+[70,330].map(x=>`<circle cx="${x}" cy="200" r="38" fill="#f4f6fa"/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return`<circle cx="${(x+Math.cos(a)*30).toFixed(1)}" cy="${(200+Math.sin(a)*30).toFixed(1)}" r="12" fill="#fff"/>`}).join('')}<circle cx="${x}" cy="200" r="20" fill="#e3262e"/>`).join(''),1]];
// ropa
const SHIRTS=[
 ['Playera',k=>`<path d="M166 324C176 340 224 340 234 324" fill="none" stroke="${k.sd}" stroke-width="7" stroke-linecap="round"/>`],
 ['Cuello tortuga',k=>`<path d="M160 314C176 322 224 322 240 314L244 342C226 350 174 350 156 342Z" fill="${k.sd}"/>${[172,186,200,214,228].map(x=>`<path d="M${x} 320L${x+(x-200)*.1} 344" stroke="${sh(k.SH,-22)}" stroke-width="1.6" opacity=".7"/>`).join('')}`],
 ['Sudadera',k=>`<path d="M116 344C122 312 156 298 200 298C244 298 278 312 284 344C262 352 238 348 222 334L178 334C162 348 138 352 116 344Z" fill="${k.sd}"/><path d="M178 334L222 334" stroke="${sh(k.SH,-24)}" stroke-width="4"/><path d="M188 340C186 356 186 368 184 382M212 340C214 356 214 368 216 382" stroke="${k.sl}" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="180" y="380" width="7" height="10" rx="2" fill="${k.L}"/><rect x="213" y="380" width="7" height="10" rx="2" fill="${k.L}"/>`],
 ['Camisa',k=>`<path d="M200 372L172 322L154 338L180 370Z" fill="${k.sl}"/><path d="${MD('M200 372L172 322L154 338L180 370Z')}" fill="${k.sl}"/><circle cx="200" cy="384" r="3.5" fill="${k.sd}"/><circle cx="200" cy="402" r="3.5" fill="${k.sd}"/>`],
 ['Malla técnica',k=>`<path d="${k.BD}" fill="${k.u('ms')}"/><path d="M164 322C176 336 224 336 236 322" fill="none" stroke="${k.L}" stroke-width="4" opacity=".9"/>`],
 ['Jersey Nexus',k=>`<path d="M162 322L200 350L238 322" fill="none" stroke="${k.L}" stroke-width="8" stroke-linejoin="round"/><path d="M44 404C80 390 110 386 130 386M356 404C320 390 290 386 270 386" stroke="${k.L}" stroke-width="8" fill="none"/><text x="200" y="408" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="40" fill="${k.sl}" stroke="${k.L}" stroke-width="2">${k.num}</text>`],
 ['Rayas',k=>`<g clip-path="${k.u('bc')}">${[340,358,376,394,412].map(y=>`<path d="M20 ${y}L380 ${y}" stroke="${k.sl}" stroke-width="8" opacity=".85"/>`).join('')}</g><path d="M166 324C176 340 224 340 234 324" fill="none" stroke="${k.sd}" stroke-width="7" stroke-linecap="round"/>`],
 ['Logo Nexus',k=>`<path d="M166 324C176 340 224 340 234 324" fill="none" stroke="${k.sd}" stroke-width="7" stroke-linecap="round"/><g transform="translate(200 382)"><path d="M0 -26L22 0L0 26L-22 0Z" fill="none" stroke="${k.L}" stroke-width="5"/>${k.glow(`<path d="M0 -12L10 0L0 12L-10 0Z" fill="${k.L}"/>`)}</g>`],
 ['Cuello V',k=>`<path d="M168 322L200 364L232 322" fill="${k.u('sk2')}" stroke="${k.sd}" stroke-width="6" stroke-linejoin="round"/>`],
 ['Uniforme',k=>`<path d="M156 316C176 324 224 324 244 316L246 340C226 348 174 348 154 340Z" fill="${k.sd}"/><path d="M200 340L200 430" stroke="${k.sd}" stroke-width="4"/>${[360,384,408].map(y=>`<circle cx="214" cy="${y}" r="4" fill="url(#§mt)"/>`).join('')}<path d="M70 372L140 352" stroke="${k.L}" stroke-width="4" opacity=".9"/><path d="M70 384L140 364" stroke="${k.L}" stroke-width="2" opacity=".6"/>`],
 ['Suéter navideño',k=>`<g clip-path="${k.u('bc')}"><path d="M20 368L380 368L380 392L20 392Z" fill="#f4f6fa"/>${[...Array(18)].map((_,i)=>`<path d="M${20+i*20} 392L${30+i*20} 380L${40+i*20} 392Z" fill="#2e8b57"/><path d="M${20+i*20} 368L${30+i*20} 378L${40+i*20} 368Z" fill="#e3262e"/>`).join('')}${[70,140,260,330].map((x,i)=>`<g transform="translate(${x} ${i%2?414:348})">${flake('#f4f6fa',9,2.4)}</g>`).join('')}</g><path d="M160 314C176 322 224 322 240 314L244 342C226 350 174 350 156 342Z" fill="#e3262e"/>`,1],
 ['Pijama a cuadros',k=>`<path d="${k.BD}" fill="${k.u('plaid')}"/><path d="M200 372L172 322L154 338L180 370Z" fill="${k.sl}"/><path d="${MD('M200 372L172 322L154 338L180 370Z')}" fill="${k.sl}"/>`,1]];
const JACKETS=[
 ['Ninguna',()=>''],
 ['Techwear',k=>k.two(k.Lp,k.u('jk'))+k.two(k.Col,k.jl)+k.sl2('M184 344L192 430','url(#§mt)',2.5,'stroke-dasharray="3 2"')+k.two('M104 360L148 356L150 384L106 388Z',k.jd)+k.sl2('M106 362L148 358','url(#§mt)',2)+k.glow(`<rect x="140" y="352" width="6" height="12" rx="2" fill="${k.L}"/><rect x="254" y="352" width="6" height="12" rx="2" fill="${k.L}"/>`)+k.sl2('M60 370C86 356 116 348 146 342',k.jl,5,'opacity=".5"')+`<rect x="286" y="352" width="30" height="20" rx="4" fill="${k.jd}"/><path d="M292 358L310 358M292 364L304 364" stroke="${k.L}" stroke-width="2.5"/>`],
 ['Bomber',k=>k.two('M36 430C40 376 68 342 120 330C146 324 170 322 194 322L196 430Z',k.u('jk'))+`<path d="M150 318C176 326 224 326 250 318L254 340C226 348 174 348 146 340Z" fill="${k.jd}"/>${[160,176,192,208,224,240].map(x=>`<path d="M${x} 322L${x} 342" stroke="${sh(k.J,-28)}" stroke-width="1.6"/>`).join('')}<path d="M200 344L200 430" stroke="url(#§mt)" stroke-width="3"/>`+k.sl2('M62 372C88 358 118 350 150 346',k.jl,5,'opacity=".5"')],
 ['Cuero',k=>`<path d="M36 430C40 376 68 342 120 330C142 324 160 321 172 320L216 430Z" fill="${k.u('jk')}"/><path d="M364 430C360 376 332 342 280 330C258 324 240 321 228 320L226 430Z" fill="${k.u('jk')}"/><path d="M150 326L172 320L198 372L160 352Z" fill="${k.jd}"/><path d="M250 326L228 320L222 366L240 352Z" fill="${k.jd}"/><path d="M172 320L214 430" stroke="url(#§mt)" stroke-width="2.5"/>`],
 ['Rompevientos',k=>`<path d="${k.BD}" fill="${k.u('jk')}"/><path d="M40 400C80 384 140 378 200 378C260 378 320 384 360 400L362 420C320 404 260 398 200 398C140 398 80 404 38 420Z" fill="${k.L}" opacity=".85"/><path d="M152 318C176 326 224 326 248 318L252 342C226 350 174 350 148 342Z" fill="${k.jd}"/><path d="M200 346L200 430" stroke="${k.jd}" stroke-width="3"/>`],
 ['Chaleco táctico',k=>k.two('M70 430L76 352C100 336 140 328 172 324L190 430Z',k.u('jk'))+k.two('M96 372L134 368L136 396L98 400Z',k.jd)+k.two('M146 372L174 370L176 398L148 400Z',k.jd)+k.glow(`<rect x="112" y="364" width="8" height="5" rx="2" fill="${k.L}"/><rect x="280" y="364" width="8" height="5" rx="2" fill="${k.L}"/>`)+k.sl2('M76 352C100 336 140 328 172 324',k.jl,4,'opacity=".6"')],
 ['Sudadera abierta',k=>`<path d="M110 346C118 310 154 294 200 294C246 294 282 310 290 346C266 334 234 328 200 328C166 328 134 334 110 346Z" fill="${k.jd}"/>`+k.two(k.Lp,k.u('jk'))+k.sl2('M184 344L192 430','url(#§mt)',2.5,'stroke-dasharray="3 2"')+`<path d="M182 350C180 368 180 380 178 394M218 350C220 368 220 380 222 394" stroke="${k.jl}" stroke-width="3" fill="none" stroke-linecap="round"/>`],
 ['Varsity',k=>k.two('M36 430C40 376 68 342 120 330C146 324 170 322 194 322L196 430Z',k.u('jk'))+k.two('M36 430C40 376 68 342 104 334L120 430Z',k.u('sh'))+`<path d="M150 318C176 326 224 326 250 318L254 340C226 348 174 348 146 340Z" fill="${k.sl}"/><path d="M150 318C176 326 224 326 250 318" stroke="${k.L}" stroke-width="3" fill="none"/>${[372,392,412].map(y=>`<circle cx="200" cy="${y}" r="4" fill="${k.sl}"/>`).join('')}<text x="152" y="392" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="${k.sl}" stroke="${k.L}" stroke-width="1.5">N</text>`],
 ['Gabardina',k=>k.two('M36 430C40 376 68 342 120 330C142 324 160 321 172 320L184 430Z',k.u('jk'))+k.two('M150 328L172 320L188 370L162 356L136 338Z',k.jl)+k.two('M132 336L148 330L152 346Z',k.jd)+k.sl2('M92 360L112 430',k.jd,2,'opacity=".6"')+[382,410].map(y=>`<circle cx="168" cy="${y}" r="4" fill="${k.jd}"/><circle cx="232" cy="${y}" r="4" fill="${k.jd}"/>`).join('')],
 ['Puffer',k=>`<path d="${k.BD}" fill="${k.u('jk')}"/>${[352,376,400,424].map(y=>`<path d="M30 ${y}C120 ${y-14} 280 ${y-14} 370 ${y}" fill="none" stroke="${k.jd}" stroke-width="3" opacity=".8"/><path d="M40 ${y-10}C120 ${y-22} 280 ${y-22} 360 ${y-10}" fill="none" stroke="${k.jl}" stroke-width="5" opacity=".35" stroke-linecap="round"/>`).join('')}<path d="M150 316C176 326 224 326 250 316L256 344C226 354 174 354 144 344Z" fill="${k.jd}"/><path d="M200 348L200 430" stroke="url(#§mt)" stroke-width="3"/>`],
 ['Traje',k=>k.two('M36 430C40 376 68 342 120 330C142 324 160 321 174 320L194 430Z',k.u('jk'))+k.two('M174 320L194 380L166 350L150 330Z',k.jd)+`<path d="M192 330L208 330L204 344L196 344Z" fill="${k.L}"/><path d="M196 344L204 344L212 404L200 416L188 404Z" fill="${k.L}"/>`+[388,412].map(y=>`<circle cx="186" cy="${y}" r="3.5" fill="${k.jd}"/>`).join('')],
 ['Armadura',k=>k.two('M36 430C40 376 68 342 120 330C142 324 160 321 172 320L184 430Z',k.u('jk'))+k.two('M30 382C34 352 66 330 112 326C128 340 130 362 122 382C96 376 60 376 30 382Z',k.u('hel2'))+k.sl2('M40 372C66 358 96 354 118 356',k.L,3)+k.glow(`<circle cx="200" cy="384" r="14" fill="none" stroke="${k.L}" stroke-width="4"/><circle cx="200" cy="384" r="6" fill="${k.L}"/>`)],
 ['Abrigo de Santa',k=>`<path d="${k.BD}" fill="#d81f26"/><path d="M36 430C40 376 68 342 120 330C110 360 106 396 108 430Z" fill="#b5161d" opacity=".55"/><path d="M186 330L214 330L216 430L184 430Z" fill="#f4f6fa"/>${[340,362,384,406,428].map(y=>`<circle cx="186" cy="${y}" r="8" fill="#fff"/><circle cx="214" cy="${y}" r="8" fill="#fff"/>`).join('')}<path d="M150 316C176 328 224 328 250 316L256 342C226 354 174 354 144 342Z" fill="#f4f6fa"/><path d="M30 404L370 404L370 424L30 424Z" fill="#15171c"/><rect x="182" y="398" width="36" height="32" rx="4" fill="none" stroke="#ffd36b" stroke-width="5"/>`,1],
 ['Chaleco de elfo',k=>k.two('M70 430L76 352C100 336 140 328 172 324L190 430Z','#2e8b57')+k.two('M70 416L90 404L110 416L130 404L150 416L170 404L190 416L190 430L70 430Z','#e3262e')+k.glow(`<circle cx="110" cy="368" r="6" fill="#ffd36b"/><circle cx="290" cy="368" r="6" fill="#ffd36b"/>`),1],
 ['Abrigo de invierno',k=>`<path d="${k.BD}" fill="${k.u('jk')}"/><path d="M200 346L200 430" stroke="${k.jd}" stroke-width="4"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=Math.PI*(i/11),x=200-Math.cos(a)*64,y=322+Math.sin(a)*22;return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="#f4f6fa"/>`}).join('')}<path d="M64 380C66 396 70 412 74 430M336 380C334 396 330 412 326 430" stroke="${k.jl}" stroke-width="4" opacity=".5" fill="none"/>`,1]];
const CHEST=[
 ['Ninguno',()=>''],
 ['Cables',k=>{const cb=d=>`<path d="${d}" fill="none" stroke="${k.L}" stroke-width="4" stroke-linecap="round"/>`;return k.glow(cb('M146 292C132 320 150 350 174 372')+cb('M254 292C268 326 246 356 224 384'))+`<rect x="168" y="368" width="12" height="18" rx="3" fill="${k.Bd}"/><rect x="218" y="380" width="12" height="18" rx="3" fill="${k.Bd}"/>`}],
 ['Dije Nexus',k=>`<path d="M170 330C176 352 188 364 200 372C212 364 224 352 230 330" fill="none" stroke="url(#§mt)" stroke-width="2.6" stroke-dasharray="3 2"/><g transform="translate(200 386)"><path d="M0 -15L12 0L0 15L-12 0Z" fill="url(#§mt)"/>${k.glow(`<path d="M0 -8L6 0L0 8L-6 0Z" fill="${k.L}"/>`)}</g>`],
 ['Placa',k=>`<path d="M172 330C178 350 190 360 200 366C210 360 222 350 228 330" fill="none" stroke="url(#§mt)" stroke-width="2.4" stroke-dasharray="3 2"/><rect x="188" y="364" width="24" height="32" rx="5" fill="url(#§mt)"/>`+k.glow(`<path d="M194 374L206 374M194 382L202 382" stroke="${k.L}" stroke-width="2.5"/>`)],
 ['Arnés',k=>`<path d="M120 334L200 384L280 334M200 384L200 430" fill="none" stroke="${k.Bd}" stroke-width="11"/><circle cx="200" cy="384" r="12" fill="url(#§mt)"/>`+k.glow(`<circle cx="200" cy="384" r="5" fill="${k.L}"/>`)],
 ['Bufanda',k=>`<path d="M146 318C170 342 230 342 254 318L262 346C232 366 168 366 138 346Z" fill="${k.L}"/><path d="M146 318C170 342 230 342 254 318" fill="none" stroke="${sh(k.L,18)}" stroke-width="4" opacity=".6"/><path d="M228 350L242 414L262 410L250 348Z" fill="${sh(k.L,-10)}"/>`],
 ['Moño',k=>`<path d="M200 338L172 324L172 352Z" fill="${k.L}"/><path d="M200 338L228 324L228 352Z" fill="${k.L}"/><rect x="192" y="330" width="16" height="16" rx="4" fill="${sh(k.L,-14)}"/>`],
 ['Corbata',k=>`<path d="M190 330L210 330L206 346L194 346Z" fill="${k.L}"/><path d="M194 346L206 346L214 408L200 424L186 408Z" fill="${k.L}"/><path d="M196 360L210 376M192 384L212 404" stroke="${sh(k.L,-18)}" stroke-width="3"/>`],
 ['Medalla',k=>`<path d="M180 330L196 380M220 330L204 380" stroke="${k.L}" stroke-width="8"/><circle cx="200" cy="392" r="16" fill="#ffd36b" stroke="#c8902e" stroke-width="3"/><path d="${starD(9,4)}" transform="translate(200 392)" fill="#c8902e"/>`],
 ['Mochila',k=>k.sl2('M132 334C140 360 144 390 146 430',k.Bd,12)+`<rect x="128" y="380" width="22" height="12" rx="3" fill="url(#§mt)"/><rect x="250" y="380" width="22" height="12" rx="3" fill="url(#§mt)"/>`],
 ['Insignia',k=>`<g transform="translate(130 372)"><path d="M0 -16L14 -8L14 8L0 16L-14 8L-14 -8Z" fill="${k.Bd}" stroke="url(#§mt)" stroke-width="2.5"/>${k.glow(`<path d="M0 -8L6 0L0 8L-6 0Z" fill="${k.L}"/>`)}</g>`],
 ['Cadena gruesa',k=>`<path d="M164 328C172 360 186 378 200 384C214 378 228 360 236 328" fill="none" stroke="#ffd36b" stroke-width="7" stroke-dasharray="9 4" stroke-linecap="round"/>`],
 ['Bufanda navideña',k=>`<path d="M146 318C170 342 230 342 254 318L262 346C232 366 168 366 138 346Z" fill="#e3262e"/>${[160,184,208,232].map(x=>`<path d="M${x} ${330+(x-200)**2/160}L${x+10} ${332+(x-200)**2/160}L${x+8} ${352+(x-200)**2/200}L${x-2} ${350+(x-200)**2/200}Z" fill="#f4f6fa"/>`).join('')}<path d="M228 350L242 414L262 410L250 348Z" fill="#e3262e"/>${[364,380,396].map(y=>`<path d="M${232+(y-350)*.22} ${y}L${254+(y-350)*.12} ${y-2}" stroke="#f4f6fa" stroke-width="6"/>`).join('')}`,1],
 ['Luces',k=>`<path d="M40 372C110 410 160 350 200 380C240 410 290 350 360 384" fill="none" stroke="#15171c" stroke-width="3"/>`+k.glow([[70,384,'#ff3b2f'],[110,392,'#ffd36b'],[150,370,'#3fae6e'],[200,380,'#73dbe4'],[250,392,'#ff4fa3'],[290,370,'#ffd36b'],[330,380,'#ff3b2f']].map(([x,y,c])=>`<ellipse cx="${x}" cy="${y+8}" rx="6" ry="9" fill="${c}"/>`).join('')),1],
 ['Cascabel',k=>`<path d="M160 318C176 328 224 328 240 318L242 332C224 342 176 342 158 332Z" fill="#e3262e"/><circle cx="200" cy="348" r="13" fill="#ffd36b" stroke="#c8902e" stroke-width="3"/><path d="M190 350L210 350M200 350L200 360" stroke="#7a5a10" stroke-width="2.5"/><circle cx="196" cy="343" r="3" fill="#fff" opacity=".7"/>`,1],
 ['Moño de regalo',k=>`<path d="M200 370C176 340 150 344 156 366C160 380 184 378 200 370Z" fill="#e3262e"/><path d="M200 370C224 340 250 344 244 366C240 380 216 378 200 370Z" fill="#e3262e"/><path d="M196 374L184 410L196 404L200 414L204 404L216 410L204 374Z" fill="#b5161d"/><circle cx="200" cy="370" r="10" fill="#ff4d55"/>`,1]];
const BGS=[
 ['Halo',k=>`<rect width="400" height="400" fill="${mix(sh(k.G,-42),'#121216',.55)}"/><circle cx="200" cy="200" r="168" fill="${k.u('halo')}"/>`],
 ['Liso',k=>`<rect width="400" height="400" fill="${k.G}"/>`],
 ['Degradado',k=>`<rect width="400" height="400" fill="${k.u('bgg')}"/>`],
 ['Rombos',k=>`<rect width="400" height="400" fill="${k.G}"/><rect width="400" height="400" fill="${k.u('pr')}"/>`],
 ['Rayas',k=>`<rect width="400" height="400" fill="${k.G}"/><rect width="400" height="400" fill="${k.u('ps')}"/>`],
 ['Cuadrícula',k=>`<rect width="400" height="400" fill="${k.G}"/><rect width="400" height="400" fill="${k.u('pg')}"/>`],
 ['Circuitos',k=>`<rect width="400" height="400" fill="${sh(k.G,-30)}"/>`+[[20,60,120,60,150,90],[380,80,300,80,270,110],[30,300,90,300,110,280],[370,320,320,320,290,290],[200,0,200,40,230,70]].map(([a,b,c,d,e,f])=>`<path d="M${a} ${b}L${c} ${d}L${e} ${f}" fill="none" stroke="${k.G}" stroke-width="3" opacity=".7"/><circle cx="${e}" cy="${f}" r="5" fill="${k.G}"/>`).join('')],
 ['Estrellas',k=>{let s=`<rect width="400" height="400" fill="${mix(sh(k.G,-40),'#07070c',.6)}"/>`;const r=rnd(11);for(let i=0;i<50;i++)s+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*400).toFixed(0)}" r="${(r()*1.8+.4).toFixed(1)}" fill="#fff" opacity="${(r()*.6+.2).toFixed(2)}"/>`;return s+`<circle cx="320" cy="80" r="26" fill="${k.G}" opacity=".7"/>`}],
 ['Hexágonos',k=>`<rect width="400" height="400" fill="${k.G}"/><rect width="400" height="400" fill="${k.u('hx2')}"/>`],
 ['Synthwave',k=>`<rect width="400" height="400" fill="${k.u('syn')}"/><circle cx="200" cy="250" r="110" fill="${k.u('sun')}"/>${[214,232,250,268].map((y,i)=>`<rect x="80" y="${y}" width="240" height="${4+i}" fill="${mix(sh(k.G,-40),'#120820',.6)}"/>`).join('')}<rect y="280" width="400" height="120" fill="${mix(sh(k.G,-40),'#120820',.6)}"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${200+(i-4)*30} 280L${200+(i-4)*140} 400" stroke="${k.G}" stroke-width="2" opacity=".7"/>`).join('')}${[292,310,336,370].map(y=>`<path d="M0 ${y}L400 ${y}" stroke="${k.G}" stroke-width="2" opacity=".7"/>`).join('')}`],
 ['Bastones de caramelo',k=>`<rect width="400" height="400" fill="#f4f6fa"/><rect width="400" height="400" fill="${k.u('cane')}"/>`,1],
 ['Papel de regalo',k=>`<rect width="400" height="400" fill="#1f6b45"/><rect width="400" height="400" fill="${k.u('gift')}"/>`,1],
 ['Bosque nevado',k=>`<rect width="400" height="400" fill="${k.u('night')}"/>`+[[40,300,70],[110,280,90],[300,286,84],[370,304,66],[200,310,60]].map(([x,y,h])=>`<path d="M${x} ${y-h}L${x+h*.45} ${y}L${x-h*.45} ${y}Z" fill="#1d4d3a"/><path d="M${x} ${y-h}L${x+h*.2} ${y-h*.55}L${x-h*.2} ${y-h*.55}Z" fill="#f4f6fa" opacity=".8"/>`).join('')+`<path d="M0 320C100 300 300 300 400 320L400 400L0 400Z" fill="#eef5ff"/>${(()=>{let s='';const r=rnd(5);for(let i=0;i<40;i++)s+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*300).toFixed(0)}" r="${(r()*2+1).toFixed(1)}" fill="#fff" opacity=".8"/>`;return s})()}`,1],
 ['Nevada',k=>{let s=`<rect width="400" height="400" fill="${k.u('night')}"/><path d="M0 340C100 320 300 320 400 340L400 400L0 400Z" fill="#eef5ff"/>`;const r=rnd(9);for(let i=0;i<34;i++){const x=(r()*400).toFixed(0),d=(5+r()*6).toFixed(1),b=(-r()*10).toFixed(1),sz=(1.5+r()*3).toFixed(1);s+=`<circle cx="${x}" cy="-10" r="${sz}" fill="#fff" opacity=".9"><animateTransform attributeName="transform" type="translate" values="0 0;${(r()*30-15).toFixed(0)} 220;0 430" dur="${d}s" begin="${b}s" repeatCount="indefinite"/></circle>`}return s},1],
 ['Luces parpadeantes',k=>{let s=`<rect width="400" height="400" fill="#141519"/>`;const C=['#ff3b2f','#ffd36b','#3fae6e','#73dbe4','#ff4fa3'];[60,180,300].forEach((y,j)=>{s+=`<path d="M-10 ${y}C80 ${y+30} 140 ${y-10} 200 ${y+20}C260 ${y+50} 320 ${y} 410 ${y+24}" fill="none" stroke="#2b2f3a" stroke-width="3"/>`;for(let i=0;i<9;i++){const x=i*50+(j%2)*25,yy=y+14+Math.sin(i+j)*12;s+=`<ellipse cx="${x}" cy="${yy.toFixed(0)}" rx="7" ry="10" fill="${C[(i+j)%5]}"><animate attributeName="opacity" values="1;.25;1" dur="${(1.2+((i*7+j)%5)*.3).toFixed(1)}s" begin="${(i*.17).toFixed(2)}s" repeatCount="indefinite"/></ellipse>`}});return s},1],
 ['Aurora navideña',k=>`<rect width="400" height="400" fill="#07101c"/><path d="M-40 140C60 80 160 200 260 120C320 80 380 110 440 90L440 200C360 230 280 180 200 240C120 300 40 200 -40 260Z" fill="#3bff8a" opacity=".28"><animateTransform attributeName="transform" type="translate" values="0 0;-30 14;0 0" dur="9s" repeatCount="indefinite"/></path><path d="M-40 200C80 150 180 250 280 180C340 140 400 170 440 160L440 250C360 280 260 230 180 290C100 340 20 260 -40 300Z" fill="#ff4fa3" opacity=".2"><animateTransform attributeName="transform" type="translate" values="0 0;30 -10;0 0" dur="11s" repeatCount="indefinite"/></path><path d="M0 330C100 310 300 310 400 330L400 400L0 400Z" fill="#dfe9f7"/>`,1]];
function rnd(s){return()=>{s=(s*16807)%2147483647;return s/2147483647}}
const CAT={eyes:EYES,mouth:MOUTHS,top:TOPS,head:HEADS,shirt:SHIRTS,jacket:JACKETS,chest:CHEST,bg:BGS};
const CATN={eyes:'Ojos',mouth:'Boca',top:'Módulos',head:'Cabeza',shirt:'Camisa',jacket:'Chaqueta',chest:'Accesorio',bg:'Fondo'};
const XMAS=[];Object.keys(CAT).forEach(c=>CAT[c].forEach((it,i)=>{if(it[2])XMAS.push([c+':'+i,CATN[c]+' · '+it[0]])}));
const PAL={amber:'#ffc266',cyan:'#73dbe4',red:'#ff7772'};
const BASEC=['#1a1d25','#141418','#2b3140','#4a4f5c','#8b93a3','#d7dbe2','#efe9e2','#ffc266','#73dbe4','#ff7772','#ff7a1a','#ff4fa3','#b57bff','#4d7cff','#3bb273'];
const LIGHTC=['#ffc266','#73dbe4','#ff7772','#ff7a1a','#ff3fa4','#b57bff','#4d7cff','#3ff3ff','#3bff8a','#e8ff3b','#ffffff'];
const SCRC=['#0b0c10','#10131c','#1d2533','#2a1440','#0c2a2e','#2a0c14','#1a1a10','#e9ecf2'];
const CLOTH=['#1a1d25','#2b3140','#4a4f5c','#f3f1ec','#ffc266','#73dbe4','#ff7772','#b08a5a','#ff7a1a','#4aa3d8','#4d7cff','#3a5a40','#b57bff','#ff4fa3'];
const BGC=['#ffc266','#73dbe4','#ff7772','#141519','#2a2a30','#b89cf0','#8e8a84','#ff7a1a','#6ec1e4','#3bb273','#ff9eb5','#1f3b73'];
const KEYS=['eyes','mouth','top','head','shirt','jacket','chest','bg'];
function hashN(t){let h=7;t=String(t||'');for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return Math.abs(h)}
// avatar por defecto: sencillo y con los colores de Nexus Arena
function def(seed){const L=[PAL.amber,PAL.cyan,PAL.red][hashN(seed)%3];return{eyes:0,mouth:3,det:{},exc:'auto',scr:'#0b0c10',base:'#1a1d25',light:L,fin:'brillo',top:0,topc:'auto',head:0,shirt:0,shirtc:'#20232c',jacket:0,jacketc:'#2b3140',chest:0,bg:0,bgc:L,headc:'auto'}}
function clean(o,seed){const d=def(seed),s={...d};if(!o||typeof o!=='object')return s;
 KEYS.forEach(k=>{const n=+o[k];if(Number.isInteger(n)&&n>=0&&n<CAT[k].length)s[k]=n});
 ['scr','base','light','shirtc','jacketc','bgc'].forEach(k=>{if(HEX.test(o[k]||''))s[k]=o[k]});['exc','topc','headc'].forEach(k=>{if(o[k]==='auto'||HEX.test(o[k]||''))s[k]=o[k]});
 s.fin=o.fin==='mate'?'mate':'brillo';s.det={};if(o.det&&typeof o.det==='object')DETS.forEach(([k])=>{if(o.det[k])s.det[k]=1});return s}
const isX=(cat,i)=>!!(CAT[cat]&&CAT[cat][i]&&CAT[cat][i][2]);
// quita piezas navideñas que la persona no tiene (own = Set de 'cat:i', o true para ver todo)
function allow(s,own){if(own===true)return s;const o={...s};KEYS.forEach(k=>{if(isX(k,o[k])&&!(own&&own.has(k+':'+o[k])))o[k]=0});return o}
// ---- dibujo
const TPL=new Map();let RC=0;
// en celular: avatares estáticos (sin animación ni brillos pesados) para que el sitio vaya fluido
let LITE=typeof matchMedia!=='undefined'&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:820px)').matches);try{const v=localStorage.getItem('nx_lite');if(v==='1')LITE=true;else if(v==='0')LITE=false}catch(e){}
function svgOf(s,o={}){if(LITE)o={...o,thumb:1,lite:1};const key=JSON.stringify(s)+'|'+(o.vb||'')+'|'+(o.thumb?1:0)+'|'+(o.num||'');let t=TPL.get(key);if(!t){t=build(s,o);if(o.lite)t=t.replace(/<animate(Transform)?\b[^>]*\/>/g,'').replace(/ class="rb-spin"/g,'');if(TPL.size>400)TPL.clear();TPL.set(key,t)}return t.replaceAll('§','r'+(++RC)+'_')}
function build(s,o){
 const u=n=>`url(#§${n})`,B=s.base,L=s.light,X=s.exc&&s.exc!=='auto'?s.exc:L,SC=s.scr,dark=lum(B)<.35,gloss=s.fin!=='mate',hi=gloss?.55:.2;
 const Bl=sh(B,dark?14:12),Bd=sh(B,dark?-6:-16),Bseam=dark?sh(B,16):sh(B,-18),TC=s.topc&&s.topc!=='auto'?s.topc:B,A=L;
 const glow=x=>`<g filter="${u('gl')}">${x}</g>`;
 const HEL='M200 74C278 74 326 124 328 190C330 248 300 296 236 306L164 306C100 296 70 248 72 190C74 124 122 74 200 74Z';
 const VIS='M90 186C102 148 160 138 200 150C240 138 298 148 310 186C320 234 292 280 200 286C108 280 80 234 90 186Z';
 const SCR='M99 188C111 158 162 149 200 160C238 149 289 158 301 188C309 228 284 270 200 275C116 270 91 228 99 188Z';
 const BD='M36 430C40 376 68 342 120 330C150 322 176 320 200 320C224 320 250 322 280 330C332 342 360 376 364 430Z';
 const lg=(n,c,a=10,b=-12,x2=0,y2=1)=>`<linearGradient id="§${n}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${sh(c,a)}"/><stop offset="1" stop-color="${sh(c,b)}"/></linearGradient>`;
 const accC=HEX.test(s.headc||'')?s.headc:lum(B)<.2?'#2b3140':B;
 const k={u,L,X,B,Bl,Bd,hi,glow,BD,A,G:s.bgc,J:s.jacketc,SH:s.shirtc,num:o.num||'7',hc:dark?sh(B,10):sh(B,-6),
  ad:sh(accC,-16),al:sh(accC,14),sd:sh(s.shirtc,-14),sl:sh(s.shirtc,12),jd:sh(s.jacketc,lum(s.jacketc)<.2?-4:-16),jl:sh(s.jacketc,lum(s.jacketc)<.2?14:12),
  Lp:'M36 430C40 376 68 342 120 330C142 324 160 321 174 320L184 344L192 430Z',Col:'M158 320C154 306 158 296 166 292L180 322L188 346C174 340 164 332 158 320Z',
  two:(d,f,x='')=>`<path d="${d}" fill="${f}" ${x}/><path d="${MD(d)}" fill="${f}" ${x}/>`,
  sl2:(d,c,w,x='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${x}/><path d="${MD(d)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${x}/>`,
  tube:(d,w)=>`<path d="${d}" fill="none" stroke="${sh(TC,dark?-4:-16)}" stroke-width="${w+3}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${TC}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sh(TC,dark?16:12)}" stroke-width="${w*.28}" stroke-linecap="round" opacity=".7" transform="translate(-2 -3)"/>`};
 k.phones=g=>{let h=`<path d="M64 200C64 92 128 50 200 50C272 50 336 92 336 200" fill="none" stroke="${Bd}" stroke-width="15"/><path d="M70 190C72 98 132 58 200 58C268 58 328 98 330 190" fill="none" stroke="${L}" stroke-width="3" opacity=".8"/>`;
  if(g)h+=[[96,94],[130,66],[270,66],[304,94]].map(([x,y])=>`<rect x="${x-9}" y="${y-9}" width="18" height="18" rx="4" fill="${k.hc}" transform="rotate(${x<200?-40:40} ${x} ${y})"/>`).join('');
  [70,330].forEach(x=>{h+=`<rect x="${x-30}" y="160" width="60" height="82" rx="26" fill="${u('bulb')}"/><rect x="${x-21}" y="170" width="42" height="62" rx="19" fill="${Bd}"/>${glow(`<rect x="${x-21}" y="170" width="42" height="62" rx="19" fill="none" stroke="${L}" stroke-width="3.5"/>`)}<rect x="${x-24}" y="164" width="12" height="20" rx="5" fill="#fff" opacity="${hi*.3}"/>`});
  if(g)h+=`<path d="M62 236C70 276 110 296 150 290" fill="none" stroke="${Bd}" stroke-width="5" stroke-linecap="round"/>${glow(`<circle cx="152" cy="290" r="6" fill="${L}"/>`)}`;return h};
 const defs=`<defs>
 <radialGradient id="§hel" cx=".34" cy=".26" r=".85"><stop offset="0" stop-color="${sh(B,dark?26:16)}"/><stop offset=".45" stop-color="${B}"/><stop offset="1" stop-color="${sh(B,dark?-4:-20)}"/></radialGradient>
 <radialGradient id="§hel2" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="${sh(B,dark?26:16)}"/><stop offset="1" stop-color="${Bd}"/></radialGradient>
 <radialGradient id="§scr" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="${mix(SC,X,.12)}"/><stop offset=".75" stop-color="${SC}"/><stop offset="1" stop-color="${sh(SC,-6)}"/></radialGradient>
 <radialGradient id="§bulb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${sh(B,dark?22:14)}"/><stop offset="1" stop-color="${Bd}"/></radialGradient>
 ${lg('top',TC,dark?18:10,dark?-4:-16)}${lg('sh',s.shirtc,8,-14)}${lg('jk',s.jacketc,lum(s.jacketc)<.2?12:9,-14)}${lg('acc',accC,lum(accC)<.2?14:10,-12)}${lg('bgg',s.bgc,8,-18,1,1)}${lg('sk2',sh(s.shirtc,-30),4,-6)}
 <linearGradient id="§lt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(L,14)}"/><stop offset="1" stop-color="${sh(L,-10)}"/></linearGradient>
 <linearGradient id="§mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f5f9"/><stop offset="1" stop-color="#8d96a5"/></linearGradient>
 <radialGradient id="§halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${sh(s.bgc,8)}"/><stop offset=".85" stop-color="${s.bgc}"/><stop offset="1" stop-color="${sh(s.bgc,-10)}"/></radialGradient>
 <linearGradient id="§syn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140a2a"/><stop offset=".7" stop-color="${mix(s.bgc,'#3a0a4a',.5)}"/></linearGradient>
 <linearGradient id="§sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sh(s.bgc,14)}"/><stop offset="1" stop-color="#ff4fa3"/></linearGradient>
 <linearGradient id="§night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1630"/><stop offset="1" stop-color="#26406e"/></linearGradient>
 <filter id="§gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${o.thumb?2:3.2}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <clipPath id="§sc"><path d="${SCR}"/></clipPath><clipPath id="§hc"><path d="${HEL}"/></clipPath><clipPath id="§bc"><path d="${BD}"/><rect x="150" y="290" width="100" height="60"/></clipPath>
 <pattern id="§ln" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.3" fill="#fff" opacity=".05"/></pattern>
 <pattern id="§hx" width="16" height="14" patternUnits="userSpaceOnUse"><path d="M4 0L12 0L16 7L12 14L4 14L0 7Z" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/></pattern>
 <pattern id="§hx2" width="34" height="30" patternUnits="userSpaceOnUse"><path d="M8 0L26 0L34 15L26 30L8 30L0 15Z" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/></pattern>
 <pattern id="§pr" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 4L36 20L20 36L4 20Z" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="2"/></pattern>
 <pattern id="§ps" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="10" height="22" fill="#fff" fill-opacity=".08"/></pattern>
 <pattern id="§pg" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0L0 0L0 26" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="1.5"/></pattern>
 <pattern id="§ms" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5L5 0L10 5L5 10Z" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/></pattern>
 <pattern id="§cane" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="14" height="40" fill="#e3262e"/><rect x="20" width="5" height="40" fill="#2e8b57"/></pattern>
 <pattern id="§gift" width="50" height="50" patternUnits="userSpaceOnUse"><rect x="12" y="14" width="22" height="20" rx="3" fill="#e3262e"/><path d="M23 14L23 34M12 24L34 24" stroke="#ffd36b" stroke-width="3"/><circle cx="40" cy="42" r="3" fill="#fff" opacity=".7"/><circle cx="6" cy="6" r="2" fill="#fff" opacity=".6"/></pattern>
 <pattern id="§plaid" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="${s.shirtc}"/><rect width="36" height="10" y="13" fill="#000" opacity=".25"/><rect width="10" height="36" x="13" fill="#000" opacity=".25"/><path d="M0 18L36 18M18 0L18 36" stroke="#fff" stroke-width="1.5" opacity=".35"/></pattern>
 </defs>`;
 const bg=(BGS[s.bg]||BGS[0])[1](k)+`<ellipse cx="200" cy="420" rx="190" ry="40" fill="#000" opacity=".25"/>`;
 const tp=((TOPS[s.top]||TOPS[0])[1](k))||{};
 let helm=`<path d="${HEL}" fill="${u('hel')}"/><path d="M150 98L250 98L274 134L200 152L126 134Z" fill="none" stroke="${Bseam}" stroke-width="2.2" opacity=".75" stroke-linejoin="round"/><path d="M126 134L92 160M274 134L308 160" stroke="${Bseam}" stroke-width="2" opacity=".6" stroke-linecap="round"/><path d="M112 112C134 88 166 78 196 78" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${hi*.45}"/><ellipse cx="150" cy="108" rx="22" ry="9" transform="rotate(-24 150 108)" fill="#fff" opacity="${hi*.55}"/><path d="M318 160C326 196 322 236 304 266" fill="none" stroke="${L}" stroke-width="3" opacity=".35" stroke-linecap="round"/>`
  +glow(`<rect x="106" y="146" width="16" height="5" rx="2.5" fill="${L}" transform="rotate(-38 114 148)"/><rect x="278" y="146" width="16" height="5" rx="2.5" fill="${L}" transform="rotate(38 286 148)"/><rect x="190" y="118" width="20" height="4" rx="2" fill="${L}"/>`)
  +`<path d="${VIS}" fill="${Bd}"/><path d="${VIS}" fill="none" stroke="${Bl}" stroke-width="3" opacity=".7"/><path d="${SCR}" fill="${u('scr')}"/><path d="${SCR}" fill="${u('ln')}"/>`;
 const c=X,eye=(x,sg)=>`<g transform="translate(${x} 212) scale(${sg} 1)"><g class="rb-bl">${(EYES[s.eyes]||EYES[0])[1](c)}</g></g>`;
 let ex=`<g class="rb-eyes">${eye(248,1)+eye(152,-1)}</g><g transform="translate(200 248)"><g class="rb-mo">${(MOUTHS[s.mouth]||MOUTHS[0])[1](c)}</g></g>`;const dt=s.det||{};
 if(dt.rubor)ex+=[118,282].map(x=>S(`M${x-12} 236L${x-4} 228M${x-4} 238L${x+4} 230M${x+4} 240L${x+12} 232`,c,3.5)).join('');
 if(dt.lagrimas)ex+=[152,248].map(x=>`<path d="M${x} 230C${x+6} 240 ${x+6} 248 ${x} 250C${x-6} 248 ${x-6} 240 ${x} 230Z" fill="${c}" opacity=".85"/>`).join('');
 if(dt.vena)ex+=S('M268 168C272 176 276 176 282 172M290 166C286 172 286 176 292 182M270 190C276 186 280 186 284 192M296 178C290 182 290 186 294 192',c,3.5);
 if(dt.sudor)ex+=`<path d="M128 166C136 178 136 186 128 188C120 186 120 178 128 166Z" fill="${c}" opacity=".8"/>`;
 if(dt.brillos)ex+=[[120,180,6],[284,250,5],[270,176,4]].map(([x,y,r])=>Fi(`M${x} ${y-r*2}L${x+r*.5} ${y-r*.5}L${x+r*2} ${y}L${x+r*.5} ${y+r*.5}L${x} ${y+r*2}L${x-r*.5} ${y+r*.5}L${x-r*2} ${y}L${x-r*.5} ${y-r*.5}Z`,c)).join('');
 helm+=`<g clip-path="${u('sc')}">${glow(`<g class="rb-ex">${ex}</g>`)}<rect class="rb-scan" x="80" y="-40" width="240" height="14" fill="${X}" opacity="0"/><path d="M112 184C124 166 158 160 184 166C160 170 132 182 118 202Z" fill="#fff" opacity="${lum(SC)>.6?.4:.14}"/></g>`;
 const mod=x=>`<circle cx="${x}" cy="200" r="27" fill="${u('bulb')}"/><circle cx="${x}" cy="200" r="18" fill="none" stroke="${L}" stroke-width="3" opacity=".85"/><circle cx="${x}" cy="200" r="11" fill="${Bd}"/><circle cx="${x-5}" cy="193" r="5" fill="#fff" opacity="${hi*.4}"/>`;
 helm+=mod(74)+mod(326);
 let neck=`<path d="M170 290L230 290L234 330L166 330Z" fill="${Bd}"/>${[300,310,320].map(y=>`<path d="M168 ${y}L232 ${y}" stroke="${Bl}" stroke-width="3" opacity=".6"/>`).join('')}`;
 let body=`<path d="${BD}" fill="${u('sh')}"/>`+(SHIRTS[s.shirt]||SHIRTS[0])[1](k)+(JACKETS[s.jacket]||JACKETS[0])[1](k);
 body=neck+`<g clip-path="${u('bc')}">${body}</g>`+(CHEST[s.chest]||CHEST[0])[1](k);
 const hat=(HEADS[s.head]||HEADS[0])[1](k);
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb||'0 0 400 400'}" class="rbt" data-c="${c}" data-m="${s.mouth}" data-e="${s.eyes}">${defs}${bg}<g transform="translate(30 42) scale(.85)"><g class="rb-body">${body}</g><g class="rb-head"><g class="rb-top">${tp.b||''}</g>${helm}<g class="rb-top">${tp.f||''}</g><g class="rb-hat">${hat}</g></g></g></svg>`}
// ---- animación (parpadeo, boca, respiración, inclinación) para los que tengan .rb-live
const AN=new WeakMap();
function tick(now){requestAnimationFrame(tick);if(LITE||document.hidden||now-(tick.l||0)<32)return;tick.l=now;const L=[...document.querySelectorAll('.rb-live svg.rbt')].filter(sv=>{const r=sv.getBoundingClientRect();return r.width>4&&r.bottom>0&&r.top<innerHeight});if(!L.length)return;
 const red=matchMedia('(prefers-reduced-motion:reduce)').matches;
 L.forEach((sv,idx)=>{if(idx>3)return;let a=AN.get(sv);if(!a){a={yaw:0,ty:0,next:0,blink:0,bnext:now+1200+Math.random()*1500,mnext:now+3500+Math.random()*3000,mt:0,last:now,ph:Math.random()*9};AN.set(sv,a);
   a.body=sv.querySelector('.rb-body');a.head=sv.querySelector('.rb-head');a.tops=[...sv.querySelectorAll('.rb-top')];a.bl=[...sv.querySelectorAll('.rb-bl')];a.mo=sv.querySelector('.rb-mo');a.ex=sv.querySelector('.rb-ex');a.scan=sv.querySelector('.rb-scan');a.m0=a.mo?a.mo.innerHTML:''}
  const dt=Math.min(50,now-a.last);a.last=now;
  if(!red){if(now>a.next){a.ty=Math.random()<.3?0:(Math.random()*2-1);a.next=now+1800+Math.random()*3000}
   if(now>a.bnext){a.blink=now;a.bnext=now+2400+Math.random()*3400;if(Math.random()<.2)a.bnext=now+280}
   // la boca hace un gesto y siempre vuelve a la que eligió la persona
   if(a.mo&&now>a.mnext&&!a.mt){a.mt=now;a.mk=Math.floor(Math.random()*3);a.mnext=now+5000+Math.random()*5000}
   if(a.mo&&a.mt){const t=now-a.mt,c=sv.dataset.c,m=+sv.dataset.m;let h=a.m0;
    if(a.mk===0){h=t<900?(Math.floor(t/150)%2?MOUTHS[8][1](c):a.m0||MOUTHS[7][1](c)):a.m0}
    else if(a.mk===1){h=t<1100?MOUTHS[m===4?3:4][1](c):a.m0}
    else{h=t<800?MOUTHS[m===3?1:3][1](c):a.m0}
    if(t>1200){h=a.m0;a.mt=0}if(a.mo._h!==h){a.mo.innerHTML=h;a.mo._h=h}}}else a.ty=0;
  a.yaw+=(a.ty-a.yaw)*(1-Math.pow(.996,dt));const y=a.yaw,br=red?0:Math.sin(now/1000*Math.PI*2/4+a.ph);
  if(a.body)a.body.setAttribute('transform',`translate(200 430) scale(${1+br*.006} ${1+br*.014}) translate(-200 -430)`);
  if(a.head)a.head.setAttribute('transform',`translate(${(y*4).toFixed(2)} ${(-br*2.2).toFixed(2)}) rotate(${(y*3.5).toFixed(2)} 200 300)`);
  a.tops.forEach(t=>t.setAttribute('transform',`rotate(${(-y*2.5+br*.6).toFixed(2)} 200 100)`));
  const bt=a.blink?(now-a.blink)/130:9,b=bt<1?1-bt:bt<2?bt-1:1;a.bl.forEach(e=>e.setAttribute('transform',`scale(1 ${Math.max(.1,b).toFixed(3)})`));
  if(a.ex)a.ex.setAttribute('transform',`translate(${(y*5).toFixed(2)} 0)`);
  if(a.scan&&!red){const q=((now+a.ph*500)%5200)/5200;a.scan.setAttribute('y',(140+q*160).toFixed(1));a.scan.setAttribute('opacity',q<.6?(.16*Math.sin(q/.6*Math.PI)).toFixed(3):0)}})}
if(typeof requestAnimationFrame!=='undefined')requestAnimationFrame(tick);
return{get LITE(){return LITE},setLite(v){LITE=!!v;TPL.clear()},CAT,CATN,DETS,XMAS,KEYS,BASEC,LIGHTC,SCRC,CLOTH,BGC,PAL,def,clean,allow,isX,svg:svgOf,hash:hashN,mouthArt:(i,c)=>(MOUTHS[i]||MOUTHS[0])[1](c)}})();
const avCfg=p=>{const e=p&&(EQ[p.id]||{}).av;if(!e)return null;try{return typeof e==='string'?JSON.parse(e):e}catch(x){return null}};
const avOwn=p=>{if(A&&U&&U.pid===p.id)return true;return new Set(rwOwned(p).filter(r=>r.type==='avatar'&&!isSealed(p,r)).map(r=>String(r.v)))};
const avSt=p=>{const s=RB.clean(avCfg(p),p.id);return RB.KEYS.some(k=>RB.isX(k,s[k]))?RB.allow(s,avOwn(p)):s};
const av=(p,c='')=>{const ph=p.img&&/^data:image\//.test(p.img)&&!avCfg(p);return`<div class="avatar ${ph?'':'rbav '}${c}${frm(p)}">${ph?`<img src="${esc(p.img)}" alt="">`:`<span class="rbcl">${RB.svg(avSt(p),{thumb:!/rb-live/.test(c)})}</span>`}</div>`};
// ===== CREADOR DE AVATARES =====
const RBTABS=[['Pantalla',[['eyes','Ojos','face'],['mouth','Boca','face'],['det','Detalles'],['exc','Color de ojos y boca','C','auto','Igual que las luces'],['scr','Color de pantalla','C']]],
 ['Carcasa',[['base','Color base','C'],['light','Luces','C'],['fin','Acabado','chips']]],
 ['Módulos',[['top','Módulos de la cabeza','top'],['topc','Color de los módulos','C','auto','Igual que la carcasa']]],
 ['Cabeza',[['head','Accesorio de cabeza','head'],['headc','Color del accesorio','C','auto','Automático']]],
 ['Ropa',[['shirt','Camisa','body'],['shirtc','Color de camisa','C'],['jacket','Chaqueta','body'],['jacketc','Color de chaqueta','C']]],
 ['Accesorios',[['chest','Pecho','body']]],
 ['Fondo',[['bg','Fondo','bg'],['bgc','Color del fondo','C']]]];
const RBVB={face:'104 160 192 124',top:'20 8 360 250',head:'40 30 320 300',body:'20 268 360 132',bg:''};
const RBCOL={exc:()=>RB.LIGHTC,scr:()=>RB.SCRC,base:()=>RB.BASEC,light:()=>RB.LIGHTC,topc:()=>RB.BASEC,headc:()=>RB.CLOTH,shirtc:()=>RB.CLOTH,jacketc:()=>RB.CLOTH,bgc:()=>RB.BGC};
let RBE=null;
function rbOwn(){if(!RBE)return new Set();if(A)return true;const p=D.players.find(x=>x.id===RBE.pid);return p?avOwn(p):new Set()}
function rbVis(cat,i,own){return!RB.isX(cat,i)||own===true||own.has(cat+':'+i)}
function rbDraw(){let el=$('#rbx');if(!el){el=document.createElement('div');el.id='rbx';document.body.appendChild(el);el.addEventListener('click',rbClick);el.addEventListener('change',e=>{const t=e.target;if(t.type==='color'&&t.dataset.rk)rbSet({[t.dataset.rk]:t.value})})}
 const w=RBE.w,own=rbOwn(),T=RBTABS[RBE.tab];let n=0;
 const sec=([k,t,kind,auto,autoN])=>{let h=`<div class="rbs"><h4>${esc(t)}${k==='top'?' <small>(antenas, orejas, cables, alas…)</small>':''}</h4>`;
  if(RB.CAT[k]){h+=`<div class="rbg">${RB.CAT[k].map((it,i)=>{if(!rbVis(k,i,own))return'';const x=RB.isX(k,i);n++;return`<button type="button" class="rbi ${w[k]===i?'on':''}" data-rk="${k}" data-rv="${i}" title="${esc(it[0])}">${RB.svg({...w,[k]:i},{thumb:1,vb:RBVB[kind]||undefined})}<i>${esc(it[0])}</i>${x?`<em>${A?'🎁 Recompensa':'🎄'}</em>`:''}</button>`}).join('')}</div>`}
  else if(kind==='C')h+=`<div class="rbsw">${auto?`<button type="button" class="rbch ${(w[k]||'auto')==='auto'?'on':''}" data-rk="${k}" data-rc="auto">${autoN}</button>`:''}${RBCOL[k]().map(c=>`<button type="button" class="rbc ${w[k]===c?'on':''}" style="background:${c}" data-rk="${k}" data-rc="${c}" aria-label="Color ${c}"></button>`).join('')}<label class="rbpk" title="Otro color">+<input type="color" data-rk="${k}" value="${/^#/.test(w[k]||'')?w[k]:'#ffc266'}"></label></div>`;
  else if(kind==='chips')h+=`<div class="rbsw">${[['brillo','Brillante'],['mate','Mate']].map(([v,l])=>`<button type="button" class="rbch ${w.fin===v?'on':''}" data-rk="fin" data-rc="${v}">${l}</button>`).join('')}</div>`;
  else if(k==='det')h+=`<div class="rbsw">${RB.DETS.map(([d,l])=>`<button type="button" class="rbch ${w.det&&w.det[d]?'on':''}" data-rd="${d}">${l}</button>`).join('')}</div>`;
  return h+'</div>'};
 el.innerHTML=`<div class="rbw"><div class="rbh"><h3>🤖 ${RBE.preview?'Avatares (vista de admin)':'Mi avatar'}</h3><button type="button" class="btn small secondary" data-rx="close">✕ Cerrar</button></div>
 <div class="rbp"><div class="rbf rb-live" data-rx="react" title="Tócalo para que reaccione">${RB.svg(RBE.tmp?{...w,...RBE.tmp}:w)}</div>
 <div class="rbb"><button type="button" class="btn small" data-rx="rnd">🎲 Aleatorio</button><button type="button" class="btn small secondary" data-rx="undo">↶ Deshacer</button><button type="button" class="btn small secondary" data-rx="def">Por defecto</button></div>
 <p class="subtle" style="font-size:12px;margin:8px 2px 0">${RBE.preview?'Aquí ves todas las piezas, incluidas las navideñas (🎁) que solo se consiguen como recompensa. Para darlas, crea una recompensa de tipo «🤖 Pieza de avatar».':'Tu robot se ve en todo el sitio. Las piezas 🎄 son exclusivas: se ganan como recompensa.'}</p></div>
 <div class="rbo"><div class="rbtabs">${RBTABS.map((t,i)=>`<button type="button" class="rbtab ${i===RBE.tab?'on':''}" data-rt="${i}">${t[0]}</button>`).join('')}</div>${T[1].map(sec).join('')}</div></div>
 <div class="rbft">${RBE.preview?'':`<button type="button" class="btn" data-rx="save">💾 Guardar avatar</button>`}<button type="button" class="btn secondary" data-rx="close">Cancelar</button></div>`;
 el.classList.add('on');document.body.style.overflow='hidden'}
function rbSet(ch){RBE.hist.push(JSON.stringify(RBE.w));if(RBE.hist.length>60)RBE.hist.shift();RBE.w={...RBE.w,...ch};RBE.tmp=null;RBE.dirty=true;const y=$('#rbx').scrollTop;rbDraw();$('#rbx').scrollTop=y}
function rbClose(){const el=$('#rbx');if(el){el.classList.remove('on');el.innerHTML=''}document.body.style.overflow='';RBE=null}
const RBREACT=[{eyes:3,mouth:4},{eyes:11,mouth:1},{eyes:9,mouth:12},{eyes:15,mouth:3},{eyes:14,mouth:9},{eyes:6,mouth:10,det:{vena:1}},{eyes:4,mouth:6}];
async function rbClick(e){const t=e.target.closest('[data-rt],[data-rk],[data-rd],[data-rx]');if(!t||!RBE)return;
 if(t.dataset.rt!=null){RBE.tab=+t.dataset.rt;rbDraw();$('#rbx').scrollTop=0;return}
 if(t.dataset.rk&&t.tagName==='BUTTON'){const k=t.dataset.rk;rbSet({[k]:t.dataset.rc!=null?t.dataset.rc:+t.dataset.rv});sfx('click');return}
 if(t.dataset.rd){const o={...(RBE.w.det||{})};o[t.dataset.rd]=o[t.dataset.rd]?0:1;rbSet({det:o});return}
 const x=t.dataset.rx;
 if(x==='close'){if(RBE.dirty&&!RBE.preview&&!confirm('¿Salir sin guardar los cambios de tu avatar?'))return;rbClose();return}
 if(x==='react'){RBE.tmp=RBREACT[Math.floor(Math.random()*RBREACT.length)];const y=$('#rbx').scrollTop;rbDraw();$('#rbx').scrollTop=y;clearTimeout(RBE.rt);RBE.rt=setTimeout(()=>{if(RBE){RBE.tmp=null;const y2=$('#rbx').scrollTop;rbDraw();$('#rbx').scrollTop=y2}},1400);return}
 if(x==='undo'){const h=RBE.hist.pop();if(h){RBE.w=JSON.parse(h);rbDraw()}return}
 if(x==='def'){const p=D.players.find(q=>q.id===RBE.pid);rbSet(RB.def(p?p.id:'nexus'));RBE.reset=true;return}
 if(x==='rnd'){const own=rbOwn(),pick=a=>a[Math.floor(Math.random()*a.length)],idx=(k,pr)=>{const L=RB.CAT[k].map((_,i)=>i).filter(i=>i&&rbVis(k,i,own));return Math.random()<pr&&L.length?pick(L):0};
  RBE.reset=false;rbSet({eyes:pick(RB.CAT.eyes.map((_,i)=>i).filter(i=>rbVis('eyes',i,own))),mouth:idx('mouth',.9),det:Math.random()<.25?{[pick(RB.DETS)[0]]:1}:{},exc:Math.random()<.6?'auto':pick(RB.LIGHTC),scr:pick(RB.SCRC.slice(0,7)),base:pick(RB.BASEC),light:pick(RB.LIGHTC),fin:Math.random()<.7?'brillo':'mate',top:idx('top',.8),topc:'auto',headc:Math.random()<.5?'auto':pick(RB.CLOTH),head:idx('head',.55),shirt:idx('shirt',.9),shirtc:pick(RB.CLOTH),jacket:idx('jacket',.7),jacketc:pick(RB.CLOTH),chest:idx('chest',.35),bg:idx('bg',.8),bgc:pick(RB.BGC)});return}
 if(x==='save'){const p=myP();if(!p)return;const prev={...(EQ[p.id]||{})},nx={...prev};if(RBE.reset&&JSON.stringify(RBE.w)===JSON.stringify(RB.def(p.id)))delete nx.av;else nx.av=JSON.stringify(RB.allow(RB.clean(RBE.w,p.id),rbOwn()));
  EQ[p.id]=nx;rbClose();PEND++;render();sfx('accept');const j=await api({action:'equip',token:TOK(),eq:EQ[p.id]});PEND--;if(j.ok){softSync();toast('¡Avatar guardado!')}else{EQ[p.id]=prev;render();apiErr(j,9)}}}

// ---- acciones de esta sección ----
Object.assign(act,{
 rbedit(e){const p=e&&e.pv?null:myP();if(!p&&!A)return;try{if(!$('#modal').classList.contains('hidden'))closeM()}catch(x){}const pid=p?p.id:'nexus';RBE={pid,w:p?avSt(p):RB.def(pid),tab:0,hist:[],preview:!p};rbDraw()}
});
