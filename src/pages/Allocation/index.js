import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";


import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

import diaDaSemana from "./dia.js";

const endpoint = "/allocations";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "course",
    id: "course",
    render: (course)=> course.name,
  },
  {
    value: "professor",
    id: "professor",
    render: (professor)=> professor.name,
  },
  {
    value: "DayOfWeek",
    id: "dayOfWeek",
  },
  {
    value: "StartHour",
    id: "startHour",
  },
  {
    value: "EndHour",
    id: "endHour",
  },
  
];

const INICIAL_STATE = {id: 0, professorId: 0, courseId: 0 };

const Allocations = () => {
  const [visible, setVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [allocation, setAllocation] = useState(INICIAL_STATE);

  useEffect(() => {
    api
      .get("/professors")
      .then((response) => {
        setProfessors(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
    api
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleSave = async (refetch) => {
    const data = {
      professorId: allocation.professorId,
      courseId: allocation.courseId,
      dayOfWeek: allocation.dayOfWeek,
      startHour: allocation.startHour.replace(/^(\d{2})(\d{2})/, "$1:$2+0000"),
      endHour: allocation.endHour.replace(/^(\d{2})(\d{2})/, "$1:$2+0000"),
    };

try {
  if (allocation.id) {
    await api.put(`${endpoint}/${allocation.id}`, data);

    toast.success("Atualizado com sucesso!");
  } else {
    await api.post(endpoint, data);

    toast.success("Cadastrado com sucesso!");
  }

  setVisible(false);

  await refetch();
} catch (error) {
  toast.error(error.message);
}
};

const actions = [
  {
    name: "Edit",
    action: ({ id, professor: { id: professorId }, course: { id: courseId }, dayOfWeek, startHour, endHour, }) => {
      setAllocation({ id, professorId, courseId, dayOfWeek, startHour, endHour });
      setVisible(true);
    },
  },
  {
    name: "Remove",
    action: async (item, refetch) => {
      if (window.confirm("Você tem certeza que deseja remover?")) {
        try {
          await api.delete(`${endpoint}/${item.id}`);
          await refetch();
          toast.info(`${item.name} foi removido`);
        } catch (error) {
          toast.info(error.message);
        }
      }
    },
  },
];

const onChange = ({ target: { name, value } }) => {
  setAllocation({
    ...allocation,
    [name]: value,
  });
};

return (
  <Page title="Alocações">
  <Button
    className="mb-2"
    onClick={() => {
      setAllocation(INICIAL_STATE);
      setVisible(true);
    }}
  >
    Criar Alocações
  </Button>
  <ListView actions={actions} columns={columns} endpoint={endpoint}>
    {({ refetch }) => (
      <Modal
        title={`${allocation.id ? "Update" : "Create"} Allocation`}
        show={visible}
        handleClose={() => setVisible(false)}
        handleSave={() => handleSave(refetch)}
      >
        <Form>
        <Form.Group>
            <Form.Label>Curso Nome</Form.Label>
            <select
              className="form-control"
              name="courseId"
              onChange={onChange}
              value={allocation.courseId}
            >
              <option>course select</option>
              {courses.map((course, index) => (
                <option key={`um${index}`} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Professor name</Form.Label>
            <select
              className="form-control"
              name="professorId"
              onChange={onChange}
              value={allocation.professorId}
            >
              <option>Professor select</option>
              {professors.map((professor, index) => (
                <option key={`${index}`} value={professor.id}>
                  {professor.name}
                </option>
              ))}
            </select>
          </Form.Group>
            <Form.Label>DayOfWeek</Form.Label>
            <select
              className="form-control"
              name="dayOfWeek"
              onChange={onChange}
              value={allocation.dayOfWeek}
            >
              <option>dayOfWeek select</option>
              {diaDaSemana.map((diaDaSemana, index) => (
                <option key={`dia${index}`} value={diaDaSemana.id}>
                  {diaDaSemana.name}
                </option>
              ))}
            </select>
          <Form.Group>
            <Form.Label>StartHour</Form.Label> 
            <Form.Control
              name="startHour"
              onChange={onChange}
              value={allocation.startHour}
              placeholder = "Exemplo 00:00+0000 OU 0000"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>EndHour</Form.Label>
            <Form.Control
              name="endHour"
              onChange={onChange}
              value={allocation.endHour}
              placeholder = "Exemplo 00:00+0000 OU 0000"
            />
          </Form.Group>
        </Form>
      </Modal>
    )}
  </ListView>
</Page>
);
};

export default Allocations;