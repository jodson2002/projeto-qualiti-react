import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/courses";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "Name",
    id: "name",
  },
];

const INITIAL_STATE = { id: 0, name: "" };

const Courses = () => {
  const [visible, setVisible] = useState(false);
  const [course, setCourse] = useState(INITIAL_STATE);

  const handleSave = async (refetch) => {
    try {
      if (course.id) {
        await api.put(`${endpoint}/${course.id}`, {
          name: course.name,
        });

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: course.name });

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
      action: (_course) => {
        setCourse(_course);
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

  return (
    <Page title="Cursos">
      <Button
        className="mb-2"
        onClick={() => {
          setCourse(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Curso
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${course.id ? "Update" : "Create"} Course`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  name="course"
                  onChange={(event) =>
                    setCourse({ ...course, name: event.target.value })
                  }
                  value={course.name}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Courses;
