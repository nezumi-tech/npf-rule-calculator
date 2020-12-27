import React, { createContext, useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

type SensorSize = 'full' | 'apsc-c' | 'apsc-x' | 'mft';
type TrailType = 'pin-point' | 'slight' | 'visible';
type ActionType = 'setSensorSize' | 'setPixelWidth' | 'setFocalLength' | 'setFNumber' | 'setTrailType';

interface Action {
  type: ActionType;
  message?: string;
}

interface AppStore {
  sensorSize: SensorSize;
  pixelWidth: number;
  focalLength: number;
  fNumber: number;
  trailType: TrailType;
  dispatch: (action: Action) => void;
}

const useAppStore = (): AppStore => {
  const [sensorSize, setSensorSize] = useState<SensorSize>('full');
  const [pixelWidth, setPixelWidth] = useState(6000);
  const [focalLength, setFocalLength] = useState(50);
  const [fNumber, setFNumber] = useState(1.4);
  const [trailType, setTrailType] = useState<TrailType>('pin-point');

  useEffect(() => {
    console.log({
      sensorSize,
      pixelWidth,
      focalLength,
      fNumber,
      trailType
    })
  }, [sensorSize, pixelWidth, focalLength, fNumber, trailType]);

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setSensorSize':
        setSensorSize(action.message as SensorSize);
        break;
      case 'setPixelWidth':
        setPixelWidth(parseInt(action.message as string, 10));
        break;
      case 'setFocalLength':
        setFocalLength(parseInt(action.message as string, 10));
        break;
      case 'setFNumber':
        setFNumber(parseFloat(action.message as string));
        break;
      case 'setTrailType':
        setTrailType(action.message as TrailType);
        break;
    }
  };

  return {
    sensorSize,
    pixelWidth,
    focalLength,
    fNumber,
    trailType,
    dispatch
  };
};

const AppContext = createContext<AppStore>({} as AppStore);

const InputForm: React.FC = () => {
  const { sensorSize, pixelWidth, focalLength, fNumber, trailType, dispatch } = useContext(AppContext);

  return <Form className="border p-3">
    <Form.Group>
      <Form.Label>
        センサーサイズ
    </Form.Label>
      <Form.Control as="select" value={sensorSize}
        onChange={(e) => dispatch({ type: 'setSensorSize', message: e.currentTarget.value })}>
        <option value="full">フルサイズ</option>
        <option value="apsc-c">APS-C (Canon)</option>
        <option value="apsc-x">APS-C (それ以外)</option>
        <option value="mft">マイクロフォーサーズ</option>
      </Form.Control>
    </Form.Group>
    <Form.Group>
      <div className="d-flex">
        <Form.Label>画像の横幅：</Form.Label>
        <Form.Control className="mx-1" style={{ width: 50 }} size="sm" value={pixelWidth} onChange={(e) => dispatch({ type: 'setPixelWidth', message: e.currentTarget.value })} />
        <Form.Label>[ピクセル]</Form.Label>
      </div>
      <Form.Control type="range" min={1} max={10000} value={pixelWidth}
        onChange={(e) => dispatch({ type: 'setPixelWidth', message: e.currentTarget.value })} />
    </Form.Group>
    <Form.Group>
      <div className="d-flex">
        <Form.Label>実焦点距離：</Form.Label>
        <Form.Control className="mx-1" style={{ width: 50 }} size="sm" value={focalLength} onChange={(e) => dispatch({ type: 'setFocalLength', message: e.currentTarget.value })} />
        <Form.Label>[mm]</Form.Label>
      </div>
      <Form.Control type="range" min={1} max={1000} value={focalLength}
        onChange={(e) => dispatch({ type: 'setFocalLength', message: e.currentTarget.value })} />
    </Form.Group>
    <Form.Group>
      <div className="d-flex">
        <Form.Label>絞り値：F</Form.Label>
        <Form.Control className="mx-1" style={{ width: 50 }} size="sm" value={fNumber} onChange={(e) => dispatch({ type: 'setFNumber', message: e.currentTarget.value })} />
      </div>
      <Form.Control type="range" min={0.7} max={36} value={fNumber} step={0.1}
        onChange={(e) => dispatch({ type: 'setFNumber', message: e.currentTarget.value })} />
    </Form.Group>
    <Form.Group>
      <Form.Label>
        星の写り方
    </Form.Label>
      <Form.Control as="select" value={trailType}
        onChange={(e) => dispatch({ type: 'setTrailType', message: e.currentTarget.value })}>
        <option value="pin-point">一つの点</option>
        <option value="slight">Slight Trail</option>
        <option value="visible">Visible Trail</option>
      </Form.Control>
    </Form.Group>
  </Form>;
};

const App: React.FC = () => {
  const store = useAppStore();

  return (
    <Container>
      <Row className="my-3">
        <Col className="text-center">
          <h1>NPFルール</h1>
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="text-center">
          <span>理論の詳細：<a href="https://sahavre.fr/wp/les-coulisses-de-la-regle-npf/">Les coulisses de la règle NPF</a></span>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <AppContext.Provider value={store}>
            <InputForm />
          </AppContext.Provider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
