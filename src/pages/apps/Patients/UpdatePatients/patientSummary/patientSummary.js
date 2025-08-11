import { Col, Row } from 'react-bootstrap';
import AllergiesCard from './Cards/AllergiesCard';
import SocialHistoryCard from './Cards/SocialHistoryCard';
import VitalsCard from './Cards/VitalsCard';
import ProblemsCard from './Cards/ProblemsCard';
import MedicationsCard from './Cards/MedicationsCard';
import RecentEncountersCard from './Cards/RecentEncountersCard';

const PatientSummary = ({ activeKey }) => {
    return (
        <div className=' pt-2 pb-1'>
            <Row className="g-2">
                <Col md={4} xs={6} className="d-flex">
                    <div className="w-100 d-flex flex-column h-100">
                        <VitalsCard activeKey={activeKey} />
                    </div>
                </Col>
                <Col md={4} xs={6} className="d-flex">
                    <div className="w-100 d-flex flex-column h-100">
                        <AllergiesCard activeKey={activeKey} />
                    </div>
                </Col>
                <Col md={4} xs={6} className="d-flex">
                    <div className="w-100 d-flex flex-column h-100">
                        <ProblemsCard activeKey={activeKey} />
                    </div>
                </Col>
            </Row>
            <Row className="g-2 mt-1">
                <Col md={4} xs={6} className="d-flex">
                    <div className="w-100 d-flex flex-column h-100">
                        <MedicationsCard activeKey={activeKey} />
                    </div>
                </Col>
                <Col md={4} xs={6} className="d-flex">
                    <div className="w-100 d-flex flex-column h-100">
                        <SocialHistoryCard activeKey={activeKey} />
                    </div>
                </Col>
                <Col md={4} xs={6} className="d-flex">
                    <div className="w-100 d-flex flex-column h-100">
                        <RecentEncountersCard activeKey={activeKey} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PatientSummary;
