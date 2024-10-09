import styled from 'styled-components';

export const ProfileContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%);
    backdrop-filter: blur(10px);
`;

export const Card = styled.div`
    display: flex;
    flex-direction: row;
    width: 90%;
    max-width: 1000px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    animation: fadeIn 1s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

export const LeftSection = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
`;

export const ProfileImageContainer = styled.div`
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 20px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    animation: zoomIn 1s ease-in-out;

    @keyframes zoomIn {
        from { transform: scale(0.5); }
        to { transform: scale(1); }
    }
`;

export const ProfileImage = styled.img`
    width: 100%;
    height: auto;
`;

export const RightSection = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
`;

export const Section = styled.div`
    margin-bottom: 20px;
    animation: slideIn 1s ease-in-out;

    @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;

export const SectionTitle = styled.h2`
    margin-bottom: 10px;
    color: black;
`;

export const EditButton = styled.button`
    background-color: #1890ff;
    color: white;
    padding: 10px 20px;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #40a9ff;
    }

    svg {
        margin-right: 5px;
    }
`;