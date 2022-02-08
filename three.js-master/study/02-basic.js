import * as THREE from "three";

import { OrbitControls } from "examples/jsm/controls/OrbitControls";

//컨트롤 정의하는데 사용

class App {
	constructor() {
		//밑줄로 시작하는 field와 method는 이 App 클래스 내부에서만 사용되는 private field, private method라는 의미이다. app외부에서는 _로 시작하는것은 호출해선 안된다.

		const divContainer = document.querySelector("#webgl-container");
		//field로 지정 this._divContainer로 다른 method에서 참조할 수 있도록 하기 위해
		this._divContainer = divContainer;

		//renderer 생성 three.js의 webGLRenderer라는 클래스로 생성할 수 있다.
		//antialias를 활성화 시켜주면 3차원 장면이 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio); // setPixelRatio 픽셀의 ratio 값을 정의하고 설정
		divContainer.appendChild(renderer.domElement); // renderer.domElement는 canvas 타입의 dom 객체
		this._renderer = renderer;

		//scene 객체 생성 코드
		const scene = new THREE.Scene();
		this._scene = scene;

		//method 호출
		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls(); //Obrbitcontrols 클래스를 사용하기 위해 추가

		// resize 이벤트가 필요한 이유는 renderer나 camera는 창 크기가 변경될 때 마다 그 크기에 맞게 속성 값을 재설정 필요
		// resize method 안에서 this가 가르키는 객체가 이벤트 객체가 아닌 이 App 클래스의 객체가 되도록 하기 위함이다.
		window.onresize = this.resize.bind(this);
		this.resize();

		//render method를 requestAnimationFrame이라는 API에 넘겨줘서 호출
		//render method는 실제로 3차원 그래픽 장면을 만들어 주는 method
		requestAnimationFrame(this.render.bind(this));
	}

	_setupControls() {
		//OrbitsControls 객체를 생성할 때는 카메라 객체와 마우스 이벤트를 받는 DOM 요소가 필요
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		//three.js가 3차원 그래픽을 출력할 영역에 대한 가로와 세로에 대한 크기를 얻어오는 코드
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		//크기를 이용해서 카메라 객체설정
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		this._camera = camera;
	}

	//광원생성 색상과 세기값 위치
	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	_setupModel() {
		//BoxGeometry 정육면체 (가로, 세로, 깊이)
		//면이 회색으로 채워지고 외곽선이 노란색으로 표시되는 육면체로 변경
		//BoxGeometry는 가로, 세로, 깊이에 대한 크기와 함께 가로, 세로, 깊이 각각에 대한 분할(Segments)수로 정의, 지정하지 않으면 기본값이 1
		//const geometry = new THREE.BoxGeometry(1, 1, 1); //가로  세로  깊이  크기가  모두  1
		//CircleGeometry 원판모양의 geometry 생성자에 4개의 인자를 받는다. 1. 원판 크기 반지름 기본값 1 2. 원판을 구성하는 분할개수 기본 값 8 3. 시작각도 4. 연장각도
		//const geometry = new THREE.CircleGeometry(0.9, 16, 0, Math.PI / 2);
		//원뿔모양의 geometry 생성자에 7개의 인자를 받는다.
		//1. 원의 반지름 크기 기본값 1 2. 원뿔의 높이 기본값 1 3.원뿔의 둘레방향 기본값 8 4. 원뿔의 높이 방향에 대한 분할 개수 기본값 1 5. 밑면 오픈 여부 true or false 6,7. 원뿔의 시작 각과 연장 각 기본값 0과 2pi 즉 360도
		//const geometry = new THREE.ConeGeometry(0.3, 2, 16, 9, true);
		//원통모양이 geometry 생성ㅂ자에 8개 인자를 받는다.
		//1,2. 각각 윗 면과 밑 면 해당하는 원의 반지름 크기 기본값 1 3. 원통의 높이 기본값 1 4.원통의 둘레 방향에 대한 분할 개수 기본값 8 5. 원통의 높이 방향에 대한 분할 개수 기본값 1 6. 원통의 윗면과 밑면의 오픈 여부 기본값 false 7,8. 원뿔의 시작 각과 연장 각 기본값 0과 2pi
		//const geometry = new THREE.CylinderGeometry();
		// 구형탱의 geometry 7개의 인자를 받는다.
		//1. 구의 반지름 크기 기본값 1 2. 수평 방향에 대한 불할 수 기본값 32  3. 수직방향에대한 분할수 기본값 16 4,5. 수평방향에 대한 구의 시작 각과 연장 각 기본값 0과 2pi 6,7. 수직 방향에 대한 구의 시작 가과 연장 각 기본 값 0과 pi
		//const geometry = new THREE.SphereGeometry();
		//2차원 형태의 반지 모양 6개의 이자를 받는다.
		//1. 내부 반지름값 기본값 0.5 2.외부 반지름 값 기본값 1 3.가장 자리 둘레 뱡향으로 분할 수 기본값 8 4.내부 방향에 대한 분할 수 기본값 1 5,6. 시작 각과 연장 각 기본값 0과 2pi
		//const geometry = new THREE.RingGeometry();
		//평면 모양 사각형 인자 4개 받는다.  PlaneGeometry는 지리 정보 시스템, 즉 GIS에서 3차원 지형 등을 표현하는데 유용하게 사용
		//1. 너비에 대한 길이 기본값 1 2. 높이에 대한 길이 기본값 1 3. 너비 방향에 대한 분할 수 기본 값 1 4. 높이 방향에 대한 분할 수 기본값 1
		//const geometry = new THREE.PlaneGeometry();
		//3차원 반지 모양 도넛같이도 생김 4개의 인자를 ㅂ다는다.
		//1. 토러스의 반지름 기본 값 1 2.토러스 원통의 반지름 값 기본 값 0.4 3. 토러스의 방사 방향 ? 기본값 8 4.긴 원통의 분할 수 기본값 6 5. 토러스의 연장 각의 길이 (시작각이 따로 없고 연장 각의 길이만 인자로 받는다.) 기본값 360도 2pi
		//const geometry = new THREE.TorusGeometry();
		//모양은 멋지지만 활용도는 떨어진다. 프렛즐 같이생김 1. 반지름 2. 원통의 반지름 크기 3,4. 분할 수 5,6. 구성하는데 사용되는 어떤 반복 수
		const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 1, 2);
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x96ccfd }); //회색색상 재재질
		const cube = new THREE.Mesh(geometry, fillMaterial); //mesh타입의 오브젝트 생성

		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); //노란색 선에 대한 재질
		const line = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry),
			lineMaterial
		); //line타입의 오브젝트를 생성
		//WireframeGeometry 클래스 -> 와이어프레임 형태로 지오메트리를 표현하기 위해 사용, 사용하지 않은 경우 모델의 모든 외고가선이 표시되지 않는다.

		//mash 오브젝트와 line 오브젝트를 하나의 오브젝트로 다루기 위해 grop으로 묶는다.
		const group = new THREE.Group();
		group.add(cube);
		group.add(line);

		//grop을 scene에 추가
		this._scene.add(group);
		this._cube = group;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		//카메라 속성값 설정
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		//renderer 크기 설정
		this._renderer.setSize(width, height);
	}

	render(time) {
		//time 인자는 렌더링이 처음 시작된 이후 경과된 시간값으로 단위가 milli-second이다.
		// renderer가 scene을 카메라의 시점으로 렌더링하라는 코드 -> 애니메이션 효과 발생
		this._renderer.render(this._scene, this._camera);
		//render method가 반복해 호출 적당한 시점에 최대한 빠르게 호출
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; //second unit
		// 정육변체의 x, y축에 대한 회전값에 time을 지정 x,y축으로 큐브가 회전한

		//이분이 자동으로 정육면체를 회전시키는 코드이다.
		//this._cube.rotation.x = time;
		//this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
