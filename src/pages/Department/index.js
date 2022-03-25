import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";


const endpoint = "/departments";

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

const Department = () => {
  const [visible, setVisible] = useState(false);
  const [department, setDepartment] = useState(INITIAL_STATE);
  const [course, setCourse] = useState([])

  const handleSave = async (refetch) => {
    try {
      if (department.id) {
        await api.put(`${endpoint}/${department.id}`, {
          name: department.name,
        });

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: department.name });

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
      action: (_department) => {
        setDepartment(_department);
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
    <Page title="Department">
      <Button
        className="mb-2"
        onClick={() => {
          setDepartment(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Departament
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${department.id ? "Update" : "Create"} Department`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Departament Name</Form.Label>
                <Form.Control
                  name="department"
                  onChange={(event) =>
                    setDepartment({ ...department, name: event.target.value })
                  }
                  value={department.name}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Department;