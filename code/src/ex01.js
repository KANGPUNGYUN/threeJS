import * as THREE from 'three';

// ----- 주제: 기본 장면 구성

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas, // canvas: canvas, 변수이름과 똑같다면 한번만 사용할 수 있음
		antialias: true // 질감을 의미, 기본값 false
	});
	renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기를 브라우저 창 크기로
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 고해상 디스플레이 지원. 소수점을 사용하면 threejs 성능이 떨어진다.
	console.log(window.devicePixelRatio);
	renderer.shadowMap.enabled = true; // 그림자가 생기도록

	// Scene
	const scene = new THREE.Scene();
	// 배경색 설정
	scene.background = new THREE.Color('white'); // 기본값은 black입니다.

	// Camera(카메라)
	const camera = new THREE.PerspectiveCamera( // 원근법적인 카메라: 우리 눈에 가장 가까운 시각효과 카메라이다  
		75, // 시야각(field of view)
		window.innerWidth / window.innerHeight, // 장면 비율
		0.1, // near(가까이 보이는 한계)
		1000 // far(멀리 보이는 한계)
	);
	camera.position.set(0, 1, 5); // 카메라 위치
	scene.add(camera);

	// Light(조명)
	// 은은한 조명
	const ambientLight = new THREE.AmbientLight('white', 0.5); // 색상, 강도
	scene.add(ambientLight);
	// 스팟 조명
	const spotLight = new THREE.SpotLight('white', 0.7); // 색상, 강도
	spotLight.position.set(-2, 5, 3); // 위치 세팅
	spotLight.castShadow = true; // 그림자를 만들 수 있도록
	spotLight.shadow.mapSize.width = 1024; // 그림자 해상도
	spotLight.shadow.mapSize.height = 1024;
	scene.add(spotLight);

	// Mesh
	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(5, 5),
		new THREE.MeshStandardMaterial({
			color: 'lightgray'
		})
	);
	floor.receiveShadow = true; // 표면에 그림자가 생길 수 있도록
	floor.rotation.x = -Math.PI * 0.5; // Math.PI는 180도

	const box = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshStandardMaterial({
			color: 'red'
		})
	);
	box.castShadow = true; // 그림자를 만들 수 있도록
	box.position.y = 0.5;

	scene.add(floor, box);

	// 기기 성능 차이에 따른 애니메이션 속도 차이를 없애기 위해 three.js에서 제공하는 Clock 사용
	// FPS게임인데, 총알이 날라가는 속도가 연산이 느린 컴퓨터에서 프레임은 끊겨도 되지만 속도는 같아야 한다. delta는 기기 성능에 맞춰 동일한 속도를 나타낼 수 있는 보정 기술이다. 성능이 낮은 기기에서 delta를 사용하면 성능이 좋은 기기에 비해서 속도는 같되 프레임이 낮아질 수 있다.
	const clock = new THREE.Clock();

	// 빠르게 반복 실행 되는 그리기 함수
	function draw() {
		const delta = clock.getDelta(); // draw 실행 시간 간격
		// const time = clock.getElapsedTime(); // 총 경과 시간

		// box.rotation.y += 0.01;
		box.rotation.y += delta * 1; // 회전 속도
		// box.rotation.y = time;
		// box.rotation.y += 0.01; // Radian: 2PI가 360도
		// 기기 성능 차이에 따른 애니메이션 속도 차이를 없애기 위해 Clock의 delta 사용

		// 렌더링
		renderer.render(scene, camera);
		// draw 함수 반복 실행
		renderer.setAnimationLoop(draw); // threejs기능이지만 내부적으로 window.requestAnimationFrame으로 사용, but VR작업 같은 경우는 setAnimationLoop를 사용해야 호환되는 것이 있기 때문에 이것을 사용하는 것을 권장
		// window.requestAnimationFrame(draw); //
	}

	// 캔버스 사이즈를 브라우저 창 사이즈에 맞추기
	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix(); // 카메라 관련 속성이 변하면 실행
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	// 브라우저 창 사이즈 변경 시, 캔버스 사이즈를 맞추기 위해 실행
	window.addEventListener('resize', setSize);

	draw();
}
