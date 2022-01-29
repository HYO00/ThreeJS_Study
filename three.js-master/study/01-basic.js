import * as THREE from "../build/three.module.js";

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

		// resize 이벤트가 필요한 이유는 renderer나 camera는 창 크기가 변경될 때 마다 그 크기에 맞게 속성 값을 재설정 필요
		// resize method 안에서 this가 가르키는 객체가 이벤트 객체가 아닌 이 App 클래스의 객체가 되도록 하기 위함이다.
		window.onresize = this.resize.bind(this);
		this.resize();

		//render method를 requestAnimationFrame이라는 API에 넘겨줘서 호출
		//render method는 실제로 3차원 그래픽 장면을 만들어 주는 method
		requestAnimationFrame(this.render.bind(this));
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
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

		const cube = new THREE.Mesh(geometry, material);

		this._scene.add(cube); //cube는 scene 객체의 구성 요소 로 추가
		this._cube = cube;
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
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
