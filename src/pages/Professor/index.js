import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

import Department from "../Department";

const endpoint = "/professors";

const columns = [
    {
        value: "id",
        id: "id"
    }, {
        value: "name",
        id: "name"
    }, {
        value: "department",
        id: "department",
        render: (department) => department.name,
    },
        {
        value: "department",
        id: "department",
        render: (department) => department.id,
        }, {
        value: "cpf",
        id: "cpf"
    }
]

const INITIAL_STATE = { id: 0, name: "", cpf: "", departmentId: 0 , };

const Professor = () => {
    const [visible, setVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [professor, setProfessor] = useState(INITIAL_STATE);

    useEffect(() => {
        api
          .get("/departments")
          .then((response) => {
            setDepartments(response.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }, []);

      const handleSave = async (refetch) => {
        const data = {
          name: professor.name,
          cpf: professor.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
          departmentId: professor.departmentId,
        };
    
        try {
    
        if(professor.cpf.length == 14) {
        
          if (professor.id) {
    
            await api.put(`${endpoint}/${professor.id}`, data);
    
            toast.success("Atualizado com sucesso!");
          } else {
            await api.post(endpoint, data);
    
            toast.success("Cadastrado com sucesso!");
          }
    
          setVisible(false);
          await refetch();
    
        } else if (professor.cpf.length == 11) {
            if (professor.id) {
              await api.put(`${endpoint}/${professor.id}`, data);
      
              toast.success("Atualizado com sucesso!");
            } else {
              await api.post(endpoint, data);
      
              toast.success("Cadastrado com sucesso!");
            }
      
            setVisible(false);
            await refetch();
          
        } else {
          toast.error("Este não é um formato correto");
        }
        } catch (error) {
          toast.error(error.message);
        }
      };

    const actions = [
        {
            name: "Edit",
            action: ({id , name, cpf , department : {id : departmentId}}) => {
                setProfessor({id, name, cpf, departmentId} );
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

    const onChange =({ target: {name,value}}) => {
      setProfessor({
          ...professor,
          [name]: value,
      });
  };

    return (
        <Page title="Professor">
          <Button
            className="mb-2"
            onClick={() => {
              setProfessor(INITIAL_STATE);
              setVisible(true);
            }}
          >
            Criar Professor
          </Button>
          <ListView actions={actions} columns={columns} endpoint={endpoint}>
            {({ refetch }) => (
              <Modal
                title={`${Professor.id ? "Update" : "Create"} Professor`}
                show={visible}
                handleClose={() => setVisible(false)}
                handleSave={() => handleSave(refetch)}
              >
                <Form>
                            <Form.Group>
                                <Form.Label>Professor Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    onChange= {onChange} 
                                        
                                    
                                    value={professor.name}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>cpf</Form.Label>
                                <Form.Control
                                    name="cpf"
                                    onChange={onChange}
                                    value={professor.cpf}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Departament Name</Form.Label>
                                    <select
                                    
                                    className="form-control"
                                    name="departmentId"
                                    onChange={onChange}
                                    
                                    value={professor.departmentId}
                                    >
                                      <option>Selecione o Departamento</option>
                                      {departments.map((department, index) => (
                                        <option key={index} value={department.id}>
                                          {department.name}
                                        </option>
                                      ))}
                                    </select>
                                  
                                
                            </Form.Group>
                        </Form>
              </Modal>
            )}
          </ListView>
        </Page>
      );
};


export default Professor;