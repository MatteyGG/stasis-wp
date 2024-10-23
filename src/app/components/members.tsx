
export interface member {
    username: string;
    role: string;
    rank: string;
}

const Memberlist = ({
    username,
    role,
    rank
}: member) => {
    return (
      <li className={`member ${role} ${rank}`}>
        <b>
          {rank} {username}
        </b>
      </li>
    );
};

export default Memberlist